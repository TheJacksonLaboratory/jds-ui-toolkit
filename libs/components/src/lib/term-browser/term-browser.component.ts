import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, linkedSignal, model, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Observable, Subject, catchError, defer, from, isObservable, map, merge, mergeMap, of, switchMap } from 'rxjs';
import {
  JDS_TERM_BROWSER_LABELS,
  JdsTerm,
  JdsTermBrowserError,
  JdsTermBrowserLabels,
  JdsTermBrowserRow,
  JdsTermExpandEvent,
  JdsTermResolver,
  JdsTermSelectEvent,
  JdsTermTreeNode
} from './term-browser.model';

/** Milliseconds a typeahead buffer survives between keystrokes. */
const TYPEAHEAD_WINDOW = 500;

/** A request to resolve one term's children into every position it occupies. */
interface Expansion {
  /** The term being expanded. */
  term: JdsTerm;
  /** Identities of the positions to fill. */
  keys: string[];
}

/** The outcome of an {@link Expansion}. */
interface Resolution extends Expansion {
  /** The children that were resolved, or undefined when the request failed. */
  children?: JdsTerm[];
  /** Why the request failed, when it did. */
  cause?: unknown;
}

@Component({
  selector: 'lib-jds-term-browser',
  standalone: true,
  imports: [ProgressSpinner],
  templateUrl: './term-browser.component.html',
  styleUrl: './term-browser.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tw-flex tw-h-full tw-min-h-0 tw-flex-col tw-gap-3 tw-bg-[var(--jds-term-browser-background)] tw-pt-6 tw-px-6 tw-pb-8' }
})
export class JdsTermBrowserComponent {
  private host: ElementRef<HTMLElement> = inject(ElementRef);

  /** The term the tree is centred on. Two-way, so it composes with an autocomplete. */
  term = model<JdsTerm | null>(null);

  /**
   * Positions to render in the full tree view, as returned by `buildTermTree`.
   *
   * Already merged on shared prefix: a term reachable by several routes appears once per
   * route, each occurrence carrying its own subtree.
   */
  tree = model<JdsTermTreeNode[]>([]);

  /** Resolves a position's children when it is expanded. */
  childrenResolver = input.required<JdsTermResolver>();

  /**
   * Whether a tree is being loaded, which replaces the rows with a spinner.
   *
   * Expanding a position is reported per row instead, so this stays false while children
   * are resolved.
   */
  loading = input(false);

  /** Whether descendant counts are rendered beside non-leaf terms. */
  showCounts = model(true);

  /** Whether choosing a term re-centres the tree on it rather than only emitting. */
  reFocusOnSelect = model(false);

  /** Heading above the browser. */
  title = model('Term Browser');

  /** Accessible name of the tree. */
  ariaLabel = model('Ontology term hierarchy');

  /** Overrides for the component's own text. */
  labels = model<Partial<JdsTermBrowserLabels>>({});

  /** Emitted when a term is chosen. */
  termSelect = output<JdsTermSelectEvent>();
  /** Emitted when a position is expanded. */
  expandTerm = output<JdsTermExpandEvent>();
  /** Emitted when children could not be resolved. */
  loadError = output<JdsTermBrowserError>();

  // A new tree is a new set of positions, so everything keyed by position resets with it.

  /** Positions whose children are hidden, by node key. */
  private collapsed = linkedSignal<JdsTermTreeNode[], ReadonlySet<string>>({
    source: this.tree,
    computation: () => new Set()
  });
  /** Positions whose children are being resolved, by node key. */
  private resolving = linkedSignal<JdsTermTreeNode[], ReadonlySet<string>>({
    source: this.tree,
    computation: () => new Set()
  });
  /** Children resolved lazily, by node key. */
  private resolved = linkedSignal<JdsTermTreeNode[], ReadonlyMap<string, JdsTerm[]>>({
    source: this.tree,
    computation: () => new Map()
  });
  /** Row the roving tabindex currently sits on. */
  readonly activeKey = linkedSignal<JdsTermTreeNode[], string | null>({
    source: this.tree,
    computation: () => null
  });
  /** Most recent status message, announced politely. */
  readonly status = signal('');

  private typeahead = '';
  private typeaheadAt = 0;

  /** The component's text, with consumer overrides applied. */
  readonly text = computed<JdsTermBrowserLabels>(() => ({ ...JDS_TERM_BROWSER_LABELS, ...this.labels() }));

  /** The rows to render, in the order they appear on screen. */
  readonly rows = computed<JdsTermBrowserRow[]>(() => {
    const collapsed = this.collapsed();
    const resolving = this.resolving();
    const resolved = this.resolved();
    const selectedId = this.term()?.id;
    const rows: JdsTermBrowserRow[] = [];

    const visit = (nodes: JdsTermTreeNode[], level: number) => {
      nodes.forEach((node, index) => {
        const lazy = resolved.get(node.key);
        const children = node.children.length ? node.children : this.asNodes(node, lazy);
        // A position is open only once it has children to show. A term that reports
        // descendants it has not resolved yet is expandable but closed, so its twisty
        // points at children that are not on screen rather than at nothing.
        const hasChildren = children.length > 0;
        const expandable = hasChildren || (node.term.descendantCount ?? 0) > 0;
        const open = hasChildren && !collapsed.has(node.key);
        rows.push({
          node,
          level,
          posinset: index + 1,
          setsize: nodes.length,
          expanded: expandable ? open : undefined,
          selected: node.term.id === selectedId,
          loading: resolving.has(node.key)
        });
        if (open) {
          visit(children, level + 1);
        }
      });
    };

    visit(this.tree(), 1);
    return rows;
  });

  /** Expansions asked for by the reader. */
  private requested = new Subject<Expansion>();

  constructor() {
    toObservable(this.tree)
      .pipe(
        switchMap(roots =>
          merge(of(...this.focusExpansions(roots)), this.requested).pipe(
            mergeMap(expansion => this.fetchChildren(expansion))
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe(resolution => this.apply(resolution));
  }

  /**
   * Get the expansion that opens every position holding the focus term.
   * @param roots - the tree to scan
   * @returns one expansion, or none when the focus term has no children to load
   */
  private focusExpansions(roots: JdsTermTreeNode[]): Expansion[] {
    const positions: JdsTermTreeNode[] = [];
    const visit = (nodes: JdsTermTreeNode[]) => {
      for (const node of nodes) {
        if (node.isFocus && node.children.length === 0 && (node.term.descendantCount ?? 0) > 0) {
          positions.push(node);
        }
        visit(node.children);
      }
    };

    visit(roots);
    return positions.length ? [{ term: positions[0].term, keys: positions.map(node => node.key) }] : [];
  }

  /**
   * Wrap lazily resolved children as positions below a node.
   *
   * Sorted by name, because a backend is free to return children in any order and the
   * ancestors above them are already ordered that way.
   * @param parent - the position being expanded
   * @param children - the resolved children, if any
   */
  private asNodes(parent: JdsTermTreeNode, children: JdsTerm[] | undefined): JdsTermTreeNode[] {
    return [...(children ?? [])]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(term => ({
        term,
        path: [...parent.path, term.id],
        key: `${parent.key}>${term.id}`,
        children: [],
        isFocus: false
      }));
  }

  /**
   * Show or hide a position's children, resolving them on first expansion.
   * @param row - the row to toggle
   */
  toggleRow(row: JdsTermBrowserRow): void {
    if (row.expanded === undefined) {
      return;
    }
    const next = new Set(this.collapsed());
    if (row.expanded) {
      next.add(row.node.key);
      this.collapsed.set(next);
      return;
    }
    next.delete(row.node.key);
    this.collapsed.set(next);
    const key = row.node.key;
    if (row.node.children.length === 0 && !this.resolved().has(key) && !this.resolving().has(key)) {
      this.requested.next({ term: row.node.term, keys: [key] });
    }
  }

  /**
   * Run an expansion, marking its positions as resolving for as long as it is open.
   * @param expansion - the positions to fill
   */
  private fetchChildren(expansion: Expansion): Observable<Resolution> {
    return defer(() => {
      this.resolving.update(current => {
        const next = new Set(current);
        for (const key of expansion.keys) {
          next.add(key);
        }
        return next;
      });
      this.status.set(this.text().loading);
      for (const key of expansion.keys) {
        this.expandTerm.emit({ term: expansion.term, key });
      }

      const result = this.childrenResolver()(expansion.term);
      return isObservable(result) ? result : from(result);
    }).pipe(
      map(children => ({ ...expansion, children })),
      catchError(cause => of({ ...expansion, cause }))
    );
  }

  /**
   * Record the outcome of an expansion.
   * @param resolution - the expansion and what it returned
   */
  private apply({ term, keys, children, cause }: Resolution): void {
    this.resolving.update(current => {
      const next = new Set(current);
      for (const key of keys) {
        next.delete(key);
      }
      return next;
    });

    if (children === undefined) {
      this.status.set(this.text().error);
      this.loadError.emit({ term, cause });
      return;
    }

    this.resolved.update(map => {
      const next = new Map(map);
      for (const key of keys) {
        next.set(key, children);
      }
      return next;
    });
    this.status.set(`${children.length} terms loaded`);
  }

  /**
   * Choose a term.
   * @param row - the row that was activated
   */
  select(row: JdsTermBrowserRow): void {
    this.activeKey.set(row.node.key);
    this.termSelect.emit({ term: row.node.term, path: row.node.path });
    if (this.reFocusOnSelect()) {
      this.term.set(row.node.term);
    }
  }

  /**
   * Move the roving tabindex and the browser's focus to a row.
   * @param key - identity of the row to focus
   */
  private focusKey(key: string): void {
    this.activeKey.set(key);
    queueMicrotask(() => {
      const el = this.host.nativeElement.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`);
      el?.focus();
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  /**
   * Apply the tree keyboard interaction to a key press.
   * @param event - the originating key event
   * @param row - the row the key was pressed on
   */
  onKeydown(event: KeyboardEvent, row: JdsTermBrowserRow): void {
    const rows = this.rows();
    const index = rows.findIndex(candidate => candidate.node.key === row.node.key);
    const move = (to: number) => {
      event.preventDefault();
      this.focusKey(rows[Math.min(Math.max(to, 0), rows.length - 1)].node.key);
    };

    switch (event.key) {
      case 'ArrowDown':
        return move(index + 1);
      case 'ArrowUp':
        return move(index - 1);
      case 'Home':
        return move(0);
      case 'End':
        return move(rows.length - 1);
      case 'ArrowRight':
        event.preventDefault();
        if (row.expanded === false) {
          this.toggleRow(row);
        } else if (row.expanded && index + 1 < rows.length) {
          this.focusKey(rows[index + 1].node.key);
        }
        return;
      case 'ArrowLeft': {
        event.preventDefault();
        if (row.expanded) {
          this.toggleRow(row);
          return;
        }
        for (let i = index - 1; i >= 0; i--) {
          if (rows[i].level < row.level) {
            this.focusKey(rows[i].node.key);
            return;
          }
        }
        return;
      }
      case 'Enter':
      case ' ':
        // Space scrolls the container before any keyup handler could run.
        event.preventDefault();
        return this.select(row);
      case '*':
        event.preventDefault();
        return this.expandSiblings(row);
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          this.onTypeahead(event.key, index, rows);
        }
    }
  }

  /**
   * Expand every position sharing a row's parent.
   * @param row - the row whose siblings to expand
   */
  private expandSiblings(row: JdsTermBrowserRow): void {
    const parentOf = (node: JdsTermTreeNode) => node.path.slice(0, -1).join('>');
    const parent = parentOf(row.node);

    for (const sibling of this.rows().filter(candidate => parentOf(candidate.node) === parent)) {
      if (sibling.expanded === false) {
        this.toggleRow(sibling);
      }
    }
  }

  /**
   * Move focus to the next row whose term starts with what was typed.
   * @param key - the character typed
   * @param from - index of the row the key was pressed on
   * @param rows - the rows currently rendered
   */
  private onTypeahead(key: string, from: number, rows: JdsTermBrowserRow[]): void {
    const now = Date.now();
    this.typeahead = now - this.typeaheadAt > TYPEAHEAD_WINDOW ? key : this.typeahead + key;
    this.typeaheadAt = now;

    const ordered = [...rows.slice(from + 1), ...rows.slice(0, from + 1)];
    const match = ordered.find(row => row.node.term.name.toLowerCase().startsWith(this.typeahead.toLowerCase()));
    if (match) {
      this.focusKey(match.node.key);
    }
  }

  /**
   * Get the tabindex of a row, so the tree is a single tab stop.
   * @param row - the row being rendered
   */
  tabindexOf(row: JdsTermBrowserRow): number {
    const rows = this.rows();
    const current = this.activeKey();
    const active = rows.some(candidate => candidate.node.key === current)
      ? current
      : rows.find(candidate => candidate.selected)?.node.key ?? rows[0]?.node.key;
    return row.node.key === active ? 0 : -1;
  }

  /**
   * Format a descendant count for display.
   * @param term - the term being rendered
   */
  countOf(term: JdsTerm): string | null {
    const count = term.descendantCount ?? 0;
    return this.showCounts() && count > 0 ? ` (${count.toLocaleString()})` : null;
  }
}

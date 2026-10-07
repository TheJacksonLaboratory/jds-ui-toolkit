import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { isObservable } from 'rxjs';
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

@Component({
  selector: 'lib-jds-term-browser',
  standalone: true,
  templateUrl: './term-browser.component.html',
  styleUrl: './term-browser.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tw-flex tw-flex-col tw-gap-3 tw-bg-white tw-pt-6 tw-px-6 tw-pb-8' }
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

  /** Whether descendant counts are rendered beside non-leaf terms. */
  showCounts = model(true);

  /** Height at which the term list begins to scroll. */
  maxHeight = model('480px');

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

  /** Positions whose children are hidden, by node key. */
  private collapsed = signal<ReadonlySet<string>>(new Set());
  /** Positions whose children are being resolved, by node key. */
  private loading = signal<ReadonlySet<string>>(new Set());
  /** Children resolved lazily, by node key. */
  private resolved = signal<ReadonlyMap<string, JdsTerm[]>>(new Map());
  /** Row the roving tabindex currently sits on. */
  readonly activeKey = signal<string | null>(null);
  /** Most recent status message, announced politely. */
  readonly status = signal('');

  private typeahead = '';
  private typeaheadAt = 0;

  /** The component's text, with consumer overrides applied. */
  readonly text = computed<JdsTermBrowserLabels>(() => ({ ...JDS_TERM_BROWSER_LABELS, ...this.labels() }));

  /** The rows to render, in the order they appear on screen. */
  readonly rows = computed<JdsTermBrowserRow[]>(() => {
    const collapsed = this.collapsed();
    const loading = this.loading();
    const resolved = this.resolved();
    const selectedId = this.term()?.id;
    const rows: JdsTermBrowserRow[] = [];

    const visit = (nodes: JdsTermTreeNode[], level: number) => {
      nodes.forEach((node, index) => {
        const lazy = resolved.get(node.key);
        const children = node.children.length ? node.children : this.asNodes(node, lazy);
        const expandable = children.length > 0 || (node.term.descendantCount ?? 0) > 0;
        const open = expandable && !collapsed.has(node.key);
        rows.push({
          node,
          level,
          posinset: index + 1,
          setsize: nodes.length,
          expanded: expandable ? open : undefined,
          selected: node.term.id === selectedId,
          loading: loading.has(node.key)
        });
        if (open) {
          visit(children, level + 1);
        }
      });
    };

    visit(this.tree(), 1);
    return rows;
  });

  constructor() {
    // A new tree is a new set of positions, so expansion state cannot carry over.
    effect(() => {
      this.tree();
      this.collapsed.set(new Set());
      this.resolved.set(new Map());
      this.activeKey.set(null);
    });
  }

  /**
   * Get the row a key belongs to.
   * @param key - identity of the position
   */
  private rowFor(key: string | null): JdsTermBrowserRow | undefined {
    return this.rows().find(row => row.node.key === key);
  }

  /**
   * Wrap lazily resolved children as positions below a node.
   * @param parent - the position being expanded
   * @param children - the resolved children, if any
   */
  private asNodes(parent: JdsTermTreeNode, children: JdsTerm[] | undefined): JdsTermTreeNode[] {
    return (children ?? []).map(term => ({
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
    if (row.node.children.length === 0 && !this.resolved().has(row.node.key)) {
      this.resolve(row.node);
    }
  }

  /**
   * Resolve a position's children.
   * @param node - the position being expanded
   */
  private resolve(node: JdsTermTreeNode): void {
    this.loading.update(keys => new Set(keys).add(node.key));
    this.status.set(this.text().loading);
    this.expandTerm.emit({ term: node.term, key: node.key });

    const done = (children: JdsTerm[]) => {
      this.resolved.update(map => new Map(map).set(node.key, children));
      this.loading.update(keys => {
        const next = new Set(keys);
        next.delete(node.key);
        return next;
      });
      this.status.set(`${children.length} terms loaded`);
    };
    const failed = (cause: unknown) => {
      this.loading.update(keys => {
        const next = new Set(keys);
        next.delete(node.key);
        return next;
      });
      this.status.set(this.text().error);
      this.loadError.emit({ term: node.term, cause });
    };

    const result = this.childrenResolver()(node.term);
    if (isObservable(result)) {
      result.subscribe({ next: done, error: failed });
    } else {
      result.then(done).catch(failed);
    }
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
   * Expand every sibling of a row.
   * @param row - the row whose siblings to expand
   */
  private expandSiblings(row: JdsTermBrowserRow): void {
    for (const sibling of this.rows().filter(candidate => candidate.level === row.level)) {
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
    const active = this.activeKey() ?? this.rows().find(candidate => candidate.selected)?.node.key ?? this.rows()[0]?.node.key;
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

import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { OntologyService, buildTermTree } from '@jax-data-science/api-clients';
import { JdsTerm, JdsTermResolver, JdsTermTreeNode } from './term-browser.model';

/** What the browser knows about the term it is centred on. */
interface TermBrowserState {
  /** The term the tree is centred on. */
  term: JdsTerm | null;
  /** Positions to render. */
  roots: JdsTermTreeNode[];
  /** The id asked for, when the backend answered with a different one. */
  replacedFrom: string | null;
  /** Parent ids naming a term the backend did not return. */
  unresolved: string[];
  /** Whether a tree is being loaded. */
  loading: boolean;
  /** Why the last load failed. */
  error: unknown;
}

const EMPTY: TermBrowserState = {
  term: null,
  roots: [],
  replacedFrom: null,
  unresolved: [],
  loading: false,
  error: null
};

/**
 * Loads the ancestor tree of a term from whichever {@link OntologyService} the consumer
 * provides, and exposes it in the shape {@link JdsTermBrowserComponent} renders.
 *
 * The component itself stays free of any service, so it can also be driven from data the
 * consumer already holds.
 */
@Injectable({
  providedIn: 'root'
})
export class JdsTermBrowserFacade {
  private ontology = inject(OntologyService);
  private state = signal<TermBrowserState>(EMPTY);

  /** The term the tree is centred on. */
  readonly term = computed(() => this.state().term);
  /** Positions to bind to the component's `tree`. */
  readonly tree = computed(() => this.state().roots);
  /** Whether a tree is being loaded. */
  readonly loading = computed(() => this.state().loading);
  /** Why the last load failed, or null. */
  readonly error = computed(() => this.state().error);
  /** Parent ids naming a term the backend did not return. */
  readonly unresolved = computed(() => this.state().unresolved);
  /**
   * The id that was asked for when the backend resolved it to a different term, or null.
   *
   * An ontology replaces a term by giving it a new id and keeping the old one as an alias.
   * The backend resolves an alias silently, so this is the only signal that the term on
   * screen is not the one that was requested.
   */
  readonly replacedFrom = computed(() => this.state().replacedFrom);

  /**
   * Resolves a term's children, for the component's `childrenResolver`.
   * @param term - the term being expanded
   */
  readonly childrenResolver: JdsTermResolver = (term: JdsTerm) =>
    this.ontology.children(term.id).pipe(map(response => response.data));

  /**
   * Load the ancestor tree of a term.
   *
   * The relation routes reject an id the term route would have resolved, so every request
   * after the first uses the id the backend returned rather than the one asked for.
   * @param id - the term to centre the tree on
   */
  load(id: string): void {
    this.state.set({ ...EMPTY, loading: true });

    this.ontology.term(id).pipe(
      switchMap(response => {
        const focus = response.object;
        if (!focus) {
          throw new Error(`No term found for '${id}'.`);
        }
        return this.ontology.ancestors(focus.id).pipe(
          map(ancestors => {
            const tree = buildTermTree(focus, ancestors.data);
            return {
              term: focus,
              roots: tree.roots,
              replacedFrom: focus.id === id ? null : id,
              unresolved: tree.unresolved,
              loading: false,
              error: null
            } satisfies TermBrowserState;
          })
        );
      }),
      catchError(error => of({ ...EMPTY, error }))
    ).subscribe(state => this.state.set(state));
  }

  /** Discard the loaded tree. */
  clear(): void {
    this.state.set(EMPTY);
  }
}

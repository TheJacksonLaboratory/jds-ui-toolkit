import { ComponentDoc } from '../docs/docs.model';

export const termBrowserDoc: ComponentDoc = {
  name: 'Term Browser',
  slug: 'term-browser',
  category: 'Data Display',
  status: 'in-progress',
  tags: ['ontology', 'tree', 'hierarchy', 'terms'],
  isAuthRequired: false,
  contact: 'npm@jax.org',
  compodocSymbol: 'JdsTermBrowserComponent',
  description:
    'A tree of where a term sits in an ontology. A term reachable by several routes is ' +
    'rendered once per route, open at its own children. Deeper children load on expansion.',
  variations: [
    {
      id: 'live',
      title: 'Live',
      description: 'Fetched from EBI’s OLS. Pick a term to rebuild the tree.',
      language: 'html',
    },
    {
      id: 'wiring',
      title: 'Wiring the facade',
      description:
        'JdsTermBrowserFacade turns a term id into the tree the component renders. It ' +
        'injects OntologyService, so the consumer chooses which backend answers. The ' +
        'facade is providedIn root, so the binding has to be a root provider too.',
      language: 'typescript',
      code: `// app.config.ts — any OntologyService implementation will do.
import { OLSOntologyService, OntologyService } from '@jax-data-science/api-clients';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: OntologyService, useExisting: OLSOntologyService },
  ],
};

// The page that shows the browser.
@Component({
  selector: 'app-phenotype',
  imports: [JdsTermBrowserComponent],
  template: \`
    <!-- The browser fills its parent, so the parent needs a height. -->
    <div style="height: 420px">
      <lib-jds-term-browser
        [tree]="facade.tree()"
        [term]="facade.term()"
        [loading]="facade.loading()"
        [childrenResolver]="facade.childrenResolver"
        (termSelect)="facade.load($event.term.id)" />
    </div>
  \`,
})
export class PhenotypeComponent implements OnInit {
  readonly facade = inject(JdsTermBrowserFacade);

  ngOnInit(): void {
    this.facade.load('HP:0001166');
  }
}`,
    },
  ],
  usage: {
    summary:
      'Build the tree with buildTermTree, or let JdsTermBrowserFacade do it from any ' +
      'OntologyService implementation.',
    dos: [
      'Supply childrenResolver, or a term with descendants gets a twisty that does nothing.',
      'Use the id the backend returns, since an ontology may answer to a replaced term’s old id.',
      'Give the component a parent with a height; it fills whatever it is given.',
      'Bind loading while a tree is being fetched, or the reader sees the empty state instead.',
    ],
    donts: [
      'Do not merge by term id — that fabricates edges and loses which route was taken.',
      'Do not key expansion on the term id, or collapsing one occurrence collapses them all.',
      'Do not re-root on selection unless you want that; reFocusOnSelect defaults to false.',
    ],
  },
  theming: [
    { variable: '--jds-term-browser-background', default: 'var(--p-surface-0, #ffffff)', description: 'Card background.' },
    { variable: '--jds-term-browser-title-color', default: 'var(--p-text-color, #1e293b)', description: 'Heading colour.' },
    { variable: '--jds-term-browser-label-color', default: 'var(--p-text-color, #222222)', description: 'Term name and caret ring colour.' },
    { variable: '--jds-term-browser-muted-color', default: 'var(--p-text-muted-color, #454545)', description: 'Descendant count and empty state.' },
    { variable: '--jds-term-browser-twisty-color', default: 'var(--p-text-muted-color, #636363)', description: 'Chevron colour.' },
    { variable: '--jds-term-browser-selected-background', default: 'var(--p-highlight-background, #94e1dc)', description: 'Background of every row holding the selected term.' },
    { variable: '--jds-term-browser-selected-color', default: 'var(--p-highlight-color, #16191d)', description: 'Text colour on a selected row.' },
    { variable: '--jds-term-browser-focus-ring-color', default: 'var(--p-primary-color, #0177b2)', description: 'Keyboard focus ring.' },
    { variable: '--jds-term-browser-radius', default: 'var(--p-content-border-radius, 6px)', description: 'Row corner radius.' },
    { variable: '--jds-term-indent', default: '1rem', description: 'Indent per level; 0.5rem under a 20rem container.' },
  ],
};

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { JdsTermBrowserComponent } from './term-browser.component';
import { JdsTerm, JdsTermTreeNode } from './term-browser.model';

const node = (
  id: string,
  name: string,
  children: JdsTermTreeNode[] = [],
  descendantCount = children.length,
  path: string[] = [id]
): JdsTermTreeNode => ({
  term: { id, name, descendantCount },
  path,
  key: path.join('>'),
  children,
  isFocus: false
});

/** Arachnodactyly reached by both of its parents, which is the case merging must preserve. */
const polyhierarchy: JdsTermTreeNode[] = [
  node('HP:0000001', 'All', [
    node('HP:0100807', 'Long fingers', [
      { ...node('HP:0001166', 'Arachnodactyly', [], 0, ['HP:0000001', 'HP:0100807', 'HP:0001166']), isFocus: true }
    ], 3, ['HP:0000001', 'HP:0100807']),
    node('HP:0001238', 'Slender finger', [
      { ...node('HP:0001166', 'Arachnodactyly', [], 0, ['HP:0000001', 'HP:0001238', 'HP:0001166']), isFocus: true }
    ], 1, ['HP:0000001', 'HP:0001238'])
  ], 19388)
];

describe('JdsTermBrowserComponent', () => {
  let fixture: ComponentFixture<JdsTermBrowserComponent>;
  let component: JdsTermBrowserComponent;

  const resolver = jest.fn((term: JdsTerm) => of([{ id: `${term.id}-c`, name: 'Child', descendantCount: 0 }]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [JdsTermBrowserComponent] }).compileComponents();
    fixture = TestBed.createComponent(JdsTermBrowserComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('childrenResolver', resolver);
    resolver.mockClear();
  });

  const render = (tree: JdsTermTreeNode[]) => {
    component.tree.set(tree);
    fixture.detectChanges();
  };

  it('renders one row per position, with ARIA describing the depth', () => {
    render(polyhierarchy);
    const rows = component.rows();

    expect(rows.map(r => r.node.term.name)).toEqual([
      'All', 'Long fingers', 'Arachnodactyly', 'Slender finger', 'Arachnodactyly'
    ]);
    expect(rows.map(r => r.level)).toEqual([1, 2, 3, 2, 3]);
    expect(rows[1]).toMatchObject({ posinset: 1, setsize: 2 });
    expect(rows[3]).toMatchObject({ posinset: 2, setsize: 2 });
  });

  it('selects every position of the chosen term, because selection keys on the id', () => {
    render(polyhierarchy);
    component.term.set({ id: 'HP:0001166', name: 'Arachnodactyly' });
    fixture.detectChanges();

    const selected = component.rows().filter(r => r.selected);
    expect(selected.length).toEqual(2);
    expect(new Set(selected.map(r => r.node.key)).size).toEqual(2);
  });

  it('collapses one position without collapsing the same term elsewhere', () => {
    render(polyhierarchy);
    const longFingers = component.rows().filter(r => r.node.key === 'HP:0000001>HP:0100807');

    component.toggleRow(longFingers[0]);
    fixture.detectChanges();

    expect(component.rows().map(r => r.node.term.name)).toEqual([
      'All', 'Long fingers', 'Slender finger', 'Arachnodactyly'
    ]);
  });

  it('omits the count on a leaf and renders it otherwise', () => {
    render(polyhierarchy);
    expect(component.countOf({ id: 'HP:0000001', name: 'All', descendantCount: 19388 })).toEqual(' (19,388)');
    expect(component.countOf({ id: 'HP:0001166', name: 'Arachnodactyly', descendantCount: 0 })).toBeNull();
  });

  it('resolves children the first time a childless expandable row is opened', () => {
    render([node('HP:0000822', 'Hypertension', [], 7)]);
    const row = component.rows()[0];
    expect(row.expanded).toBe(true);

    component.toggleRow(row);          // collapse
    component.toggleRow(component.rows()[0]);  // expand, which resolves
    fixture.detectChanges();

    expect(resolver).toHaveBeenCalledTimes(1);
    expect(component.rows().map(r => r.node.term.name)).toEqual(['Hypertension', 'Child']);
  });

  it('treats a term reporting no descendants as a leaf', () => {
    render([node('HP:0001166', 'Arachnodactyly', [], 0)]);
    expect(component.rows()[0].expanded).toBeUndefined();
    expect(resolver).not.toHaveBeenCalled();
  });

  it('marks the selected rows in the DOM, which is what the theme styles key off', () => {
    render(polyhierarchy);
    component.term.set({ id: 'HP:0001166', name: 'Arachnodactyly' });
    fixture.detectChanges();

    const selected = fixture.nativeElement.querySelectorAll('.jds-term-row[aria-selected="true"]');
    expect(selected.length).toEqual(2);
    expect(fixture.nativeElement.querySelectorAll('.jds-term-row').length).toEqual(5);
  });

  it('keeps the tree a single tab stop', () => {
    render(polyhierarchy);
    const tabbable = component.rows().filter(r => component.tabindexOf(r) === 0);
    expect(tabbable.length).toEqual(1);
  });

  it('moves down the visible rows and reports the move', () => {
    render(polyhierarchy);
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    jest.spyOn(event, 'preventDefault');

    component.onKeydown(event, component.rows()[0]);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.activeKey()).toEqual('HP:0000001>HP:0100807');
  });

  it('emits the chosen term with the route taken to it', () => {
    render(polyhierarchy);
    const emitted: unknown[] = [];
    component.termSelect.subscribe(e => emitted.push(e));

    component.select(component.rows()[4]);

    expect(emitted).toEqual([{
      term: expect.objectContaining({ id: 'HP:0001166' }),
      path: ['HP:0000001', 'HP:0001238', 'HP:0001166']
    }]);
  });
});

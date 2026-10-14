import { OntologyTerm } from './ontology.model';
import { TermTreeNode, buildTermTree } from './ontology.tree';

const FOCUS: OntologyTerm = { id: 'HP:0001166', name: 'Arachnodactyly' };

/** Every position in the tree, depth-first. */
const flatten = (nodes: TermTreeNode[]): TermTreeNode[] =>
  nodes.flatMap(node => [node, ...flatten(node.children)]);

describe('buildTermTree', () => {
  it('renders one position per distinct root path, not one per term', () => {
    const tree = buildTermTree(FOCUS, ARACHNODACTYLY_ANCESTORS);
    const nodes = flatten(tree.roots);

    expect(ARACHNODACTYLY_ANCESTORS.length).toEqual(15);
    expect(new Set(nodes.map(n => n.term.id)).size).toEqual(16);
    expect(nodes.length).toEqual(37);
    expect(tree.nodeCount).toEqual(37);
  });

  it('places the focus term at every one of its eight positions', () => {
    const tree = buildTermTree(FOCUS, ARACHNODACTYLY_ANCESTORS);
    const focusNodes = flatten(tree.roots).filter(n => n.isFocus);

    expect(focusNodes.length).toEqual(8);
    expect(tree.pathCount).toEqual(8);
    expect(focusNodes.every(n => n.children.length === 0)).toBe(true);
    expect(new Set(focusNodes.map(n => n.key)).size).toEqual(8);
  });

  it('treats a repeated term as a distinct node per path', () => {
    const tree = buildTermTree(FOCUS, ARACHNODACTYLY_ANCESTORS);
    const repeated = flatten(tree.roots).filter(n => n.term.id === 'HP:0001167');

    expect(repeated.length).toEqual(4);
    expect(new Set(repeated.map(n => n.key)).size).toEqual(4);
    // every position is reached by a different route, so collapsing one leaves the others open
    expect(new Set(repeated.map(n => n.path.join('>'))).size).toEqual(4);
  });

  it('descends from a single root', () => {
    const tree = buildTermTree(FOCUS, ARACHNODACTYLY_ANCESTORS);
    expect(tree.roots.map(r => r.term.id)).toEqual(['HP:0000001']);
    expect(tree.roots[0].path).toEqual(['HP:0000001']);
    expect(tree.unresolved).toEqual([]);
    expect(tree.truncated).toBe(false);
  });

  it('keeps siblings in name order', () => {
    const tree = buildTermTree(FOCUS, ARACHNODACTYLY_ANCESTORS);
    for (const node of flatten(tree.roots)) {
      const names = node.children.map(c => c.term.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });

  it('reports parent ids naming a term that was not supplied', () => {
    const tree = buildTermTree(FOCUS, [
      { id: 'HP:0000118', name: 'Phenotypic abnormality', parents: ['HP:0000001'] }
    ]);
    expect(tree.unresolved).toEqual(['HP:0000001']);
    expect(tree.roots.map(r => r.term.id)).toEqual(['HP:0000118']);
  });

  it('stops at maxNodes and says so', () => {
    const tree = buildTermTree(FOCUS, ARACHNODACTYLY_ANCESTORS, { maxNodes: 5 });
    expect(tree.truncated).toBe(true);
    expect(flatten(tree.roots).length).toEqual(5);
  });

  it('does not recurse forever on a cycle', () => {
    const tree = buildTermTree(FOCUS, [
      { id: 'A:1', name: 'A', parents: ['A:2'] },
      { id: 'A:2', name: 'B', parents: ['A:1'] }
    ]);
    expect(tree.nodeCount).toBeLessThan(10);
    expect(tree.truncated).toBe(false);
  });

  it('renders a term with no ancestors as the root', () => {
    const tree = buildTermTree(FOCUS, []);
    expect(tree.roots.length).toEqual(1);
    expect(tree.roots[0].isFocus).toBe(true);
    expect(tree.pathCount).toEqual(1);
  });
});

/**
 * The 15 ancestors of HP:0001166 (Arachnodactyly), as the ancestors route returns them.
 *
 * Captured from ontology.jax.org; HPO places the term under eight distinct root paths.
 */
export const ARACHNODACTYLY_ANCESTORS: OntologyTerm[] = [
  {
    "id": "HP:0011844",
    "name": "Abnormal appendicular skeleton morphology",
    "parents": [
      "HP:0011842"
    ]
  },
  {
    "id": "HP:0011297",
    "name": "Abnormal digit morphology",
    "parents": [
      "HP:0002813"
    ]
  },
  {
    "id": "HP:0001167",
    "name": "Abnormal finger morphology",
    "parents": [
      "HP:0001155",
      "HP:0011297"
    ]
  },
  {
    "id": "HP:0002813",
    "name": "Abnormal limb bone morphology",
    "parents": [
      "HP:0011844",
      "HP:0040068"
    ]
  },
  {
    "id": "HP:0011842",
    "name": "Abnormal skeletal morphology",
    "parents": [
      "HP:0000924"
    ]
  },
  {
    "id": "HP:0040068",
    "name": "Abnormality of limb bone",
    "parents": [
      "HP:0000924",
      "HP:0040064"
    ]
  },
  {
    "id": "HP:0040064",
    "name": "Abnormality of limbs",
    "parents": [
      "HP:0000118"
    ]
  },
  {
    "id": "HP:0001155",
    "name": "Abnormality of the hand",
    "parents": [
      "HP:0002817"
    ]
  },
  {
    "id": "HP:0033127",
    "name": "Abnormality of the musculoskeletal system",
    "parents": [
      "HP:0000118"
    ]
  },
  {
    "id": "HP:0000924",
    "name": "Abnormality of the skeletal system",
    "parents": [
      "HP:0033127"
    ]
  },
  {
    "id": "HP:0002817",
    "name": "Abnormality of the upper limb",
    "parents": [
      "HP:0040064"
    ]
  },
  {
    "id": "HP:0000001",
    "name": "All",
    "parents": []
  },
  {
    "id": "HP:0100807",
    "name": "Long fingers",
    "parents": [
      "HP:0001167"
    ]
  },
  {
    "id": "HP:0000118",
    "name": "Phenotypic abnormality",
    "parents": [
      "HP:0000001"
    ]
  },
  {
    "id": "HP:0001238",
    "name": "Slender finger",
    "parents": [
      "HP:0001167"
    ]
  }
];

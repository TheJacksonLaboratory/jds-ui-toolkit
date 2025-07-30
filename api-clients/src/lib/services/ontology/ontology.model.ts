export interface OntologyConfig {
  name: string;
  prefix: string;
  github: {
    api: string;
    home: string;
  };
  home: string;
  api: {
    docs: string;
    base: string;
  };
  base_file: string;
  international: boolean;
  description: string;
}

export enum Ontology {
  HP = 'HP',
  MONDO = 'MONDO',
  MP = 'MP',
  CL = 'CL',
  MAXO = 'MAXO'
}

export interface OntologyTerm {
  id: string;
  name: string;
}

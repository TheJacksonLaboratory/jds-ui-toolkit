import { Ontology } from "./ontology.model";

/**
   * Get the ontology from curie
   */
export function ontologyFromCurie(curie: string): Ontology {
    return Ontology[curie.split(':')[0] as keyof typeof Ontology];
}
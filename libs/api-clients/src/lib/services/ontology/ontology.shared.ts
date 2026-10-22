/**
 * Get the ontology prefix of a term id.
 * @param id - the term CURIE, e.g. `HP:0001166`
 * @returns the prefix, e.g. `HP`, or undefined when the id carries no prefix
 */
export function prefixOf(id: string): string | undefined {
  const [prefix, ...rest] = id.split(':');
  return prefix && rest.length > 0 && rest.join(':') ? prefix : undefined;
}

/**
 * Convert an entity IRI to a term id.
 * @param iri - the entity IRI, e.g. `http://purl.obolibrary.org/obo/HP_0032263`
 * @returns the CURIE, e.g. `HP:0032263`, or the final IRI segment when it encodes no prefix
 */
export function curieFromIri(iri: string): string {
  const segment = iri.split(/[/#]/).pop() ?? iri;
  const match = /^([A-Za-z][A-Za-z0-9]*)_(.+)$/.exec(segment);
  return match ? `${match[1]}:${match[2]}` : segment;
}

/**
 * Raised when a term id carries no ontology prefix, so no request can be addressed to it.
 */
export class OntologyPrefixError extends Error {
  constructor(public readonly id: string) {
    super(`Term id '${id}' has no ontology prefix, expected a CURIE such as 'HP:0001166'.`);
    this.name = 'OntologyPrefixError';
  }
}


# api-clients

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test api-clients` to execute the unit tests.


## Ontology Service

Ontology Service has two implementations JAXOntologyService & OLS Ontology Service. Both converge on the same model that is
subject to change in releases.

To use any particular implementation

```
    providers: [
        {provide: OntologyService, useClass: JAXOntologyService}
    ]
```
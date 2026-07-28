import { Injectable, signal } from '@angular/core';
import { DocBase } from '@jax-data-science/component-docs';

@Injectable({ providedIn: 'root' })
export class DocsContextService {
  private _currentDoc = signal<DocBase | null>(null);
  readonly currentDoc = this._currentDoc.asReadonly();

  setCurrentDoc(doc: DocBase | null): void {
    this._currentDoc.set(doc);
  }
}

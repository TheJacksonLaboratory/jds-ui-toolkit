import { Injectable, signal } from '@angular/core';
import { ComponentDoc } from '@jax-data-science/component-docs';

@Injectable({ providedIn: 'root' })
export class DocsContextService {
  private _currentDoc = signal<ComponentDoc | null>(null);
  readonly currentDoc = this._currentDoc.asReadonly();

  setCurrentDoc(doc: ComponentDoc | null): void {
    this._currentDoc.set(doc);
  }
}

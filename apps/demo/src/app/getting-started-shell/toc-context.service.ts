import { Injectable, signal } from '@angular/core';

export interface TocHeading {
  id: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class TocContextService {
  private _headings = signal<TocHeading[]>([]);
  readonly headings = this._headings.asReadonly();

  setHeadings(headings: TocHeading[]): void {
    this._headings.set(headings);
  }
}

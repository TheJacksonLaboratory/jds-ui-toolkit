import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { OntologyService } from 'api-clients/src/lib/ontology/ontology.service.base';
import { Ontology, OntologyTerm } from 'api-clients/src/lib/ontology/ontology.model';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HighlightPipe } from '../highlight/highlight.pipe';
@Component({
  selector: 'lib-ontology-search',
  imports: [CommonModule, AutoCompleteModule, AutoCompleteModule, FormsModule, ChipModule, HighlightPipe],
  template: `
    <div class="card flex justify-center">
      <p-autoComplete
        class="ontology-search"
        [multiple]="multiple"
        [suggestions]="filteredOptions"
        (completeMethod)="filterOptions($event)"
        (onSelect)="onSelect($event)" minLength="3" delay="250"
        showClear="true" optionLabel="name">
        <ng-template let-term #item>
              <span class="tw-text-ellipsis"[innerHTML]="term.name | highlight: query$.getValue()"></span>
              <span><p-chip label="{{term.id}}"/></span>
        </ng-template>
      </p-autoComplete>
    </div>  
  `,
  styleUrls: ['./ontology-search.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class OntologySearchComponent {
  @Input() multiple = false;
  @Input() options: string[] = [];
  @Input() ontology: Ontology = Ontology.HP;
  @Input() placeholder = 'Search ontology terms...';
  @Input() extended = false;
  @Output() selected = new EventEmitter<OntologyTerm[]>();
  items: string[] = [];
  value: string | undefined;
  selectedValues: OntologyTerm[] = [];
  filteredOptions: OntologyTerm[] = [];
  query$ = new BehaviorSubject<string>("");

  constructor(private ontologyService: OntologyService) {
    this.query$.pipe(
      distinctUntilChanged(),
      switchMap(query => this.ontologyService.search(query, 100, this.ontology))
    ).subscribe(options => {
      this.filteredOptions = options.data;
    });
  }

  filterOptions(event: any) {
    const query = event.query.toLowerCase();
    this.query$.next(query);


  }

  onSelect(event: any) {
    this.selected.emit(this.selectedValues);
  }
}
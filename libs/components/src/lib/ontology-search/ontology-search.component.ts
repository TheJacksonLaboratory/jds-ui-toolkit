import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { OntologyService } from 'api-clients/src/lib/ontology/ontology.service.base';
import { Ontology, OntologyTerm } from 'api-clients/src/lib/ontology/ontology.model';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HighlightPipe } from '../highlight/highlight.pipe';
@Component({
  selector: 'lib-ontology-search',
  imports: [CommonModule, AutoCompleteModule, AutoCompleteModule, FormsModule, ChipModule, HighlightPipe],
  template: `
    <div class="card flex justify-center">
      <p-autoComplete
        #osearch 
        class="ontology-search"
        [(ngModel)]="selectedValues"
        [multiple]="multiple"
        [suggestions]="filteredOptions"
        (completeMethod)="filterOptions($event)"
        (onSelect)="onSelect($event, osearch)" minLength="3" delay="250"
        [placeholder]="placeholder"
        showClear="true" optionLabel="name"
        (onFocus)="showOptions(osearch)"
        (onClear)="query$.next(''); osearch.hide();" [virtualScrollItemSize]="10">
        <ng-template let-term #item>
              <span class="tw-truncate flex-1"[innerHTML]="term.name | highlight: query$.getValue()"></span>
              <span class="tw-ml-1"><p-chip label="{{term.id}}"/></span>
        </ng-template>
        <ng-template #footer *ngIf="extended">
        </ng-template>
      </p-autoComplete>
    </div>  
  `,
  styleUrls: ['./ontology-search.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class OntologySearchComponent {
  // TODO: multiple selection not working yet
  // TODO: extended mode not implemented yet
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
  private skipNextFocus = false;

  constructor(private ontologyService: OntologyService) {
    this.query$.pipe(
      distinctUntilChanged(),
      filter(query => query.trim() !== ''), // Only proceed if query is not empty 
      switchMap(query => {
        return this.ontologyService.search(query, 100, this.ontology);
      })
    ).subscribe(options => {
      // Only update if options.data exists (i.e., not a focus/empty query)
      if (options && options.data) {
        this.filteredOptions = options.data;
      }
    });
  }

  filterOptions(event: any) {
    const query = event.query.toLowerCase();
    this.query$.next(query);


  }

  onSelect(event: any, osearch: AutoComplete) {
    this.skipNextFocus = true;
    osearch.hide();
    this.selected.emit(this.selectedValues);
  }

  showOptions(osearch: AutoComplete) {
    if (this.query$.getValue().trim() != '' && !this.skipNextFocus) {
      osearch.show();
      this.skipNextFocus = false;
    } 
  }
}
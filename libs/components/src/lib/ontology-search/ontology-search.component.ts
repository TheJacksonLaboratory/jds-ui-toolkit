import { Component, Input, Output, EventEmitter, ViewEncapsulation, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { OntologyService } from 'api-clients/src/lib/ontology/ontology.service.base';
import { Ontology, OntologyTerm } from 'api-clients/src/lib/ontology/ontology.model';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HighlightPipe } from '../highlight/highlight.pipe';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'lib-ontology-search',
  imports: [CommonModule, AutoCompleteModule, AutoCompleteModule, FormsModule, ChipModule, 
            HighlightPipe, CheckboxModule],
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
        (onClear)="query$.next(''); osearch.hide();"
        [virtualScrollItemSize]="10"
        >
          <ng-template let-term #item>
            <div class="tw-flex tw-items-center tw-gap-2 tw-w-full">
              <p-checkbox *ngIf="multiple" class="tw-flex-none" [(ngModel)]="selectedValues" [value]="term" size="small"/>
              <span class="tw-flex-grow tw-truncate" [ngClass]="{'tw-text-center': multiple}" [innerHTML]="term.name | highlight: query$.getValue()"></span>
              <span class="tw-ml-1 tw-flex-none"><p-chip label="{{term.id}}"/></span>
            </div>
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
  @Input() multiple = false;
  @Input() ontology: Ontology = Ontology.HP;
  @Input() placeholder = 'Search ontology terms...';
  @Input() extended = false;
  @Input() max_results = 25;
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
      filter(query => query.trim() !== ''),
      switchMap(query => {
        return this.ontologyService.search(query, this.max_results, this.ontology);
      })
    ).subscribe(options => {
        this.filteredOptions = options.data;
    });
  }

  filterOptions(event: any) {
    const query = event.query.toLowerCase();
    this.query$.next(query);


  }

  onSelect(event: any, osearch: AutoComplete) {
    if (!this.multiple) {
      this.skipNextFocus = true;
      osearch.hide();
    }
    this.selected.emit(this.selectedValues);
  }

  showOptions(osearch: AutoComplete) {
    if (this.query$.getValue().trim() != '' && !this.skipNextFocus) {
      osearch.show();
    } else {
      this.skipNextFocus = false;
    }
  }
}
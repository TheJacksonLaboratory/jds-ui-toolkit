import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { OntologyService } from 'api-clients/src/lib/ontology/ontology.service.base';
import { Ontology, OntologyTerm } from 'api-clients/src/lib/ontology/ontology.model';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'lib-ontology-search',
  imports: [CommonModule, AutoCompleteModule, AutoCompleteModule, FormsModule, ChipModule],
  template: `
    <p-autoComplete
      class="ontology-search"
      [multiple]="multiple"
      [suggestions]="filteredOptions"
      (completeMethod)="filterOptions($event)"
      [(ngModel)]="selectedValues"
      (onSelect)="onSelect($event)" minLength="3" delay="750"
      showClear="true"
      [field]="'name'">
      <ng-template let-term #item>
            <div class="tw-text-ellipsis">{{ term.name }}</div>
            <div><p-chip label="{{term.id}}"/></div>
      </ng-template>
    </p-autoComplete>
  `,
  styleUrls: ['./ontology-search.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class OntologySearchComponent {
  @Input() multiple = false;
  @Input() options: string[] = [];
  @Input() ontology: Ontology = Ontology.HP;
  @Output() selected = new EventEmitter<OntologyTerm[]>();

  selectedValues: OntologyTerm[] = [];
  filteredOptions: OntologyTerm[] = [];
  private query$ = new Subject<string>();

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
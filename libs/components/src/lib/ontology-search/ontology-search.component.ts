import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OntologyService } from 'api-clients/src/lib/ontology/ontology.service.base';
import { Ontology, OntologyTerm } from 'api-clients/src/lib/ontology/ontology.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-ontology-search',
  imports: [CommonModule, AutoCompleteModule, AutoCompleteModule, FormsModule],
  template: `
    <p-autoComplete
      [multiple]="multiple"
      [suggestions]="filteredOptions"
      (completeMethod)="filterOptions($event)"
      [(ngModel)]="selectedValues"
      (onSelect)="onSelect($event)">
    </p-autoComplete>
  `,
  styleUrls: ['./ontology-search.component.css'],
  standalone: true
})
export class OntologySearchComponent {
  @Input() multiple = false;
  @Input() options: string[] = [];
  @Input() ontology: Ontology = Ontology.HP;
  @Output() selected = new EventEmitter<OntologyTerm[]>();

  selectedValues: OntologyTerm[] = [];
  filteredOptions: OntologyTerm[] = [];

  constructor(private ontologyService: OntologyService) {

  }

  filterOptions(event: any) {
    const query = event.query.toLowerCase();
    this.ontologyService.search(query, 100, this.ontology).subscribe(options => {
      this.filteredOptions = options.data;
    });
  }

  onSelect(event: any) {
    this.selected.emit(this.selectedValues);
  }
}
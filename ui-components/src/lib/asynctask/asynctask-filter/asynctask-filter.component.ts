import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Listbox, ListboxChangeEvent, ListboxFilterEvent } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { Filter, RunInput } from '../asynctask.model';
import { AsyncTaskFacade } from '../asynctask.facade';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'lib-asynctask-filter',
  imports: [
    CommonModule,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Listbox,
    FormsModule,
    Button,
    Panel,
    Chip,
  ],
  templateUrl: './asynctask-filter.component.html',
  styleUrl: './asynctask-filter.component.css',
})
export class AsyncTaskFilterComponent implements OnInit {
  @Input() tasks: RunInput[] = [];
  @Output() closeFilter = new EventEmitter();

  // descriptionOptions: (string | null | undefined)[] = [];
  descriptionOptions: { label: string; value: string }[] = [];
  descriptionFilter: string[] = [];

  filters: Filter[] = [];
  activeFilters: Filter[] = [];

  constructor(private facade: AsyncTaskFacade) {}

  ngOnInit() {
    this.facade.getFilters$().subscribe({
      next: (filters) => {
        if (filters.length) {
          this.filters = filters;
        }
      },
    });
    this.facade.getActiveFilters$().subscribe({
      next: (filters) => {
        this.activeFilters = filters;
      },
    });
  }

  onFilterChange(event: ListboxChangeEvent, filter: Filter) {
    this.facade.setActiveFilters(
      this.filters.filter((value) => value.selectedOptions.length > 0)
    );
  }

  removeFilter(filter: Filter) {
    this.facade.removeFilter(this.activeFilters, filter);
  }

  clearAllFilters() {
    this.facade.clearAllFilters(this.activeFilters);
  }

  applyFilters() {
    this.facade.setActiveFilters(
      this.filters.filter((value) => value.selectedOptions.length > 0)
    );
    this.closeFilter.emit();
  }
}

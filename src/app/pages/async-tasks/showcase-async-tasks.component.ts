import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

import { AsyncTaskComponent, IAsyncTableConfig } from '@jax-data-science-demo/ui-components';

@Component({
  selector: 'app-showcase-async-tasks',
  imports: [CommonModule, AsyncTaskComponent],
  templateUrl: './showcase-async-tasks.component.html',
  styleUrl: './showcase-async-tasks.component.css',
  standalone: true
})
export class ShowcaseAsyncTasksComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsTemplate') detailsTemplate!: TemplateRef<null>;

  tableConfiguration: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 5,
    isPaginated: true,
    rowsPerPageOptions: [5, 10, 25, 50],
    isStriped: false,
    showActions: true,
    allowFilters: true,
    filterConfigs: [
      {
        displayName: 'Description',
        filterOptions: ['test', 'test2', 'test3']
      },
      {
        displayName: 'Name',
        filterOptions: ['data', 'hello']
      }
    ],
    detailsTemplate: this.detailsTemplate
  };

  accessToken$: Observable<string> = new Observable<string>();

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.accessToken$ = this.auth.getAccessTokenSilently();
  }

  ngAfterViewInit() {
    this.tableConfiguration.detailsTemplate = this.detailsTemplate;
  }
}

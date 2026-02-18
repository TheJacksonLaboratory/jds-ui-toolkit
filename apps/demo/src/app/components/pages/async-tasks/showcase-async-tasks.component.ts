import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

import { AsyncTaskComponent, IAsyncTableConfig } from '@jax-data-science/components';

@Component({
  selector: 'app-showcase-async-tasks',
  imports: [CommonModule, AsyncTaskComponent],
  templateUrl: './showcase-async-tasks.component.html',
  styleUrl: './showcase-async-tasks.component.css',
  standalone: true
})
export class ShowcaseAsyncTasksComponent implements OnInit, AfterViewInit {
  private auth = inject(AuthService);

  @ViewChild('detailsTemplate') detailsTemplate!: TemplateRef<null>;

  tableConfiguration: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 5,
    isPaginated: true,
    rowsPerPageOptions: [5, 10, 25, 50],
    isStriped: false,
    showActions: true,
    allowFilters: true,
    detailsTemplate: this.detailsTemplate
  };

  accessToken$: Observable<string> = new Observable<string>();

  ngOnInit() {
    this.accessToken$ = this.auth.getAccessTokenSilently();
  }

  editTask(task: any) {
    console.log('Edit Task:', task);
  }

  openTask(task: any) {
    console.log('Open Task:', task);
  }

  ngAfterViewInit() {
    this.tableConfiguration.detailsTemplate = this.detailsTemplate;
  }
}

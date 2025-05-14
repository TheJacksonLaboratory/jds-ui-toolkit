import { Component, OnInit } from '@angular/core';
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
export class ShowcaseAsyncTasksComponent implements OnInit {

  tableConfiguration: IAsyncTableConfig = {
    isExpandable: true,
    rowsPerPage: 5,
    isPaginated: true,
    rowsPerPageOptions: [5, 10, 25, 50],
    isStriped: true,
    showActions: true
  };

  accessToken$: Observable<string> = new Observable<string>();

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.accessToken$ = this.auth.getAccessTokenSilently();
  }
}

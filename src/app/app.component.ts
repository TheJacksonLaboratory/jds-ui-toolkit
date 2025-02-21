import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// components
import { HeaderComponent } from './components/header/header.component';

@Component({
  imports: [
    RouterModule,
    HeaderComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'jds-ui-components';
}
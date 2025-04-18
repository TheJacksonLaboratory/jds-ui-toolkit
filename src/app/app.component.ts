import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@jds-angular/components';

@Component({
  imports: [
    RouterModule,
    NavbarComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'jds-angular';
}

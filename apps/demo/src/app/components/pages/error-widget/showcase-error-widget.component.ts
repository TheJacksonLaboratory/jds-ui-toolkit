import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showcase-widget-error',
  imports: [CommonModule],
  templateUrl: './showcase-error-widget.component.html',
  styleUrl: './showcase-error-widget.component.css',
  standalone: true
})
export class ShowcaseErrorWidgetComponent implements OnInit {

  ngOnInit() {
    console.log('ShowcaseErrorWidgetComponent initialized');
  }
}
import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-showcase-widget-error',
  imports: [],
  templateUrl: './showcase-error-widget.component.html',
  styleUrl: './showcase-error-widget.component.css',
  standalone: true
})
export class ShowcaseErrorWidgetComponent implements OnInit {

  ngOnInit() {
    console.log('ShowcaseErrorWidgetComponent initialized');
  }
}
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-showcase-schema-grid',
  imports: [],
  templateUrl: './showcase-schema-grid.component.html',
  styleUrl: './showcase-schema-grid.component.css',
  standalone: true
})
export class ShowcaseSchemaGridComponent implements OnInit {

  ngOnInit() {
    console.log('ShowcaseSchemaGridComponent initialized');
  }
}

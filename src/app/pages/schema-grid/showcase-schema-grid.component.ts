import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showcase-schema-grid',
  imports: [CommonModule],
  templateUrl: './showcase-schema-grid.component.html',
  styleUrl: './showcase-schema-grid.component.css',
  standalone: true
})
export class ShowcaseSchemaGridComponent implements OnInit {

  ngOnInit() {
    console.log('ShowcaseSchemaGridComponent initialized');
  }
}

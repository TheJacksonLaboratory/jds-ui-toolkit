import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showcase-ontology-search',
  imports: [CommonModule],
  templateUrl: './showcase-ontology-search.component.html',
  styleUrl: './showcase-ontology-search.component.css',
  standalone: true
})
export class ShowcaseOntologySearchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('ShowcaseOntologySearchComponent initialized');
  }
}

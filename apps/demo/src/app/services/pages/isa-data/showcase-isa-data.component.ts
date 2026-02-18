import { Component, OnInit, inject } from '@angular/core';


// services
import { ISADataService } from '@jax-data-science/api-clients';

// models
import { MeasureSeriesMetadata } from '@jax-data-science/api-clients';

@Component({
  selector: 'app-showcase-isa-data',
  imports: [],
  templateUrl: './showcase-isa-data.component.html',
  styleUrl: './showcase-isa-data.component.css',
  standalone: true
})
export class ShowcaseISADataComponent implements OnInit {
  private isaDataService = inject(ISADataService);

  ngOnInit() {
    this.isaDataService.getMeasureSeriesMetadata(['130499'], ['740']).subscribe(
      (response) => {
        console.log('Measurement Set Metadata:', response.object);
      },
      (error) => {
        console.error('Error fetching measurement set metadata:', error);
      }
    );

    console.log('ShowcaseISADataComponent initialized');
  }
}

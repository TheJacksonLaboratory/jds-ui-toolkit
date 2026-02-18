import { Component, ElementRef, OnInit, ViewChild, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, catchError, of } from 'rxjs';
// components
import { FacetSearchComponent, FacetSearchFacade } from '@jax-data-science/components';
// models
import { IFacetSearchCategory, IFacetOption } from '@jax-data-science/components';

// API Response interfaces
interface FilterOption {
  value: string;
  displayName: string;
  sampleCount: number;
  metadata: any;
}

interface AvailableFilters {
  strain: FilterOption[];
  site: FilterOption[];
  dose: FilterOption[];
  sex: FilterOption[];
  compound: FilterOption[];
}

interface StudyMetadata {
  studyId: string;
  treatments: string[];
  dosages: string[];
  characteristics: {
    strain: string[];
    sex: string[];
    site: string[];
  };
  description: string;
  sourceInfo: {
    service: string;
    timestamp: string;
    version: string;
    metadata: any;
  };
}

interface ApiResponse {
  studyMetadata: StudyMetadata;
  availableFilters: AvailableFilters;
  plotData: any;
}

@Component({
  selector: 'app-showcase-facet-search',
  imports: [CommonModule, FacetSearchComponent],
  templateUrl: './showcase-facet-search.component.html',
  styleUrl: './showcase-facet-search.component.css',
  standalone: true
})
export class ShowcaseFacetSearchComponent implements OnInit {
  private auth = inject(AuthService);
  private facetSearchFacade = inject(FacetSearchFacade);
  private http = inject(HttpClient);

  // facet search categories
  searchCategories: IFacetSearchCategory[] = [];

  @ViewChild('facetSearchContainer') facetSearchContainer!: ElementRef<HTMLDivElement>;

  // Computed signal to track applied searches
  appliedSearchesDisplay = computed(() => {
    const appliedSearches = this.facetSearchFacade.getAppliedSearches$()();

    // Create a readable display structure
    const displayData = {
      appliedSearches: appliedSearches,
      summary: this.createSearchSummary(appliedSearches),
      isEmpty: Object.keys(appliedSearches).length === 0
    };

    console.log('Applied searches changed:', displayData);
    return displayData;
  });

  ngOnInit() {
    this.facetSearchFacade.setIsSearchVisible(true);

    // Load facet search data
    this.loadVisualizationData().subscribe({
      next: (data) => {
        this.searchCategories = this.transformToFacetCategories(data.availableFilters);
        console.log('Search categories populated:', this.searchCategories);
      },
      error: (error) => {
        console.error('Error loading visualization data:', error);
        // Optionally set some default categories or show error message
        this.searchCategories = [];
      }
    });
  }

  isFacetSearchEnabled(): boolean {
    return true;
  }

  /**
   * Makes HTTP call to get visualization data
   */
  private loadVisualizationData(): Observable<ApiResponse> {
    const url = 'http://localhost:28080/api/v1/studies/1/visualization-data';
    const params = { measureIds: '1' };

    return this.http.get<ApiResponse>(url, { params }).pipe(
      catchError((error) => {
        console.error('HTTP request failed:', error);
        // Return empty data structure on error
        return of({
          studyMetadata: {
            studyId: '',
            treatments: [],
            dosages: [],
            characteristics: { strain: [], sex: [], site: [] },
            description: '',
            sourceInfo: { service: '', timestamp: '', version: '', metadata: null }
          },
          availableFilters: {
            strain: [],
            site: [],
            dose: [],
            sex: [],
            compound: []
          },
          plotData: null
        } as ApiResponse);
      })
    );
  }

  /**
   * Transforms API response availableFilters to IFacetSearchCategory[]
   */
  private transformToFacetCategories(availableFilters: AvailableFilters): IFacetSearchCategory[] {
    const categories: IFacetSearchCategory[] = [];

    // Transform each filter category
    Object.entries(availableFilters).forEach(([categoryName, filterOptions]) => {
      if (filterOptions && filterOptions.length > 0) {
        const category: IFacetSearchCategory = {
          name: categoryName,
          label: this.getCategoryDisplayLabel(categoryName),
          isOpen: false, // Start with categories closed
          options: filterOptions.map((option: FilterOption) => ({
            id: option.value,
            label: option.displayName,
            selected: false, // Start with no options selected
            count: option.sampleCount
          } as IFacetOption))
        };

        categories.push(category);
      }
    });

    return categories;
  }

  /**
   * Maps category names to user-friendly labels
   */
  private getCategoryDisplayLabel(categoryName: string): string {
    const labelMap: Record<string, string> = {
      'strain': 'Strain',
      'site': 'Study Site',
      'dose': 'Dosage',
      'sex': 'Sex',
      'compound': 'Treatment Compound'
    };

    return labelMap[categoryName] || this.capitalizeFirst(categoryName);
  }

  /**
   * Helper method to capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Creates a human-readable summary of applied searches
   */
  private createSearchSummary(appliedSearches: Record<string, string[]>): string[] {
    const summary: string[] = [];

    Object.entries(appliedSearches).forEach(([categoryName, selectedOptions]) => {
      if (selectedOptions.length > 0) {
        const categoryLabel = this.getCategoryDisplayLabel(categoryName);
        const optionsText = selectedOptions.join(', ');
        summary.push(`${categoryLabel}: ${optionsText}`);
      }
    });

    return summary;
  }
}
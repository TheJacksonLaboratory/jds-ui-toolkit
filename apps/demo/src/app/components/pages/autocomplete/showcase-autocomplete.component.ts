import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JdsAutocompleteComponent, JdsAutocompleteGroup, JdsAutocompleteItem } from '@jax-data-science/components';

const ALL_DATA: JdsAutocompleteGroup[] = [
  {
    groupLabel: 'Phenotypes',
    items: [
      { id: 'HP:0000118', label: 'Phenotypic abnormality' },
      { id: 'HP:0001250', label: 'Seizure' },
      { id: 'HP:0000707', label: 'Abnormality of the nervous system' },
      { id: 'HP:0001513', label: 'Obesity' },
      { id: 'HP:0000729', label: 'Autistic behavior' },
      { id: 'HP:0003011', label: 'Abnormality of the musculature' },
      { id: 'HP:0001626', label: 'Abnormality of the cardiovascular system' },
      { id: 'HP:0001249', label: 'Intellectual disability' },
      { id: 'HP:0001263', label: 'Global developmental delay' },
      { id: 'HP:0000252', label: 'Microcephaly' },
      { id: 'HP:0000256', label: 'Macrocephaly' },
      { id: 'HP:0001252', label: 'Hypotonia' },
      { id: 'HP:0002187', label: 'Intellectual disability, profound' },
      { id: 'HP:0000365', label: 'Hearing impairment' },
      { id: 'HP:0000618', label: 'Blindness' },
      { id: 'HP:0002015', label: 'Dysphagia' },
      { id: 'HP:0001156', label: 'Brachydactyly' },
      { id: 'HP:0000238', label: 'Hydrocephalus' },
    ],
  },
  {
    groupLabel: 'Diseases',
    items: [
      { id: 'OMIM:143100', label: 'Huntington disease' },
      { id: 'OMIM:300624', label: 'Rett syndrome' },
      { id: 'OMIM:209900', label: 'Bardet-Biedl syndrome' },
      { id: 'OMIM:248200', label: 'Maple syrup urine disease' },
      { id: 'OMIM:256550', label: 'Neuronal ceroid lipofuscinosis' },
      { id: 'OMIM:104300', label: 'Alzheimer disease' },
      { id: 'OMIM:168600', label: 'Parkinson disease' },
      { id: 'OMIM:219700', label: 'Cystic fibrosis' },
      { id: 'OMIM:603903', label: 'Sickle cell anemia' },
      { id: 'OMIM:310200', label: 'Duchenne muscular dystrophy' },
      { id: 'OMIM:180200', label: 'Retinoblastoma' },
      { id: 'OMIM:277900', label: 'Wilson disease' },
      { id: 'OMIM:230800', label: 'Gaucher disease' },
      { id: 'OMIM:162200', label: 'Neurofibromatosis type 1' },
      { id: 'OMIM:154700', label: 'Marfan syndrome' },
      { id: 'OMIM:220100', label: 'Pendred syndrome' },
    ],
  },
  {
    groupLabel: 'Genes',
    items: [
      { id: 'NCBIGene:672', label: 'BRCA1' },
      { id: 'NCBIGene:675', label: 'BRCA2' },
      { id: 'NCBIGene:7157', label: 'TP53' },
      { id: 'NCBIGene:5728', label: 'PTEN' },
      { id: 'NCBIGene:1956', label: 'EGFR' },
      { id: 'NCBIGene:4524', label: 'MTHFR' },
      { id: 'NCBIGene:2064', label: 'ERBB2' },
      { id: 'NCBIGene:3845', label: 'KRAS' },
      { id: 'NCBIGene:238', label: 'ALK' },
      { id: 'NCBIGene:4763', label: 'NF1' },
      { id: 'NCBIGene:1080', label: 'CFTR' },
      { id: 'NCBIGene:3064', label: 'HTT' },
      { id: 'NCBIGene:4204', label: 'MECP2' },
      { id: 'NCBIGene:1636', label: 'ACE' },
      { id: 'NCBIGene:348', label: 'APOE' },
      { id: 'NCBIGene:2200', label: 'FBN1' },
    ],
  },
];

const FLAT_DATA: JdsAutocompleteItem[] = ALL_DATA.flatMap(group => group.items);

@Component({
  selector: 'app-showcase-autocomplete',
  standalone: true,
  imports: [CommonModule, JdsAutocompleteComponent],
  templateUrl: './showcase-autocomplete.component.html',
})
export class ShowcaseAutocompleteComponent {
  // Grouped example
  groupedSuggestions = signal<JdsAutocompleteGroup[]>([]);
  groupedSelected = signal<JdsAutocompleteItem | null>(null);
  groupedTotalCount = signal<number | null>(null);
  groupedLastEvent = signal<string>('');

  // Flat example
  flatSuggestions = signal<JdsAutocompleteItem[]>([]);
  flatSelected = signal<JdsAutocompleteItem | null>(null);
  flatLastEvent = signal<string>('');

  onGroupedSearch(event: { query: string }): void {
    const q = event.query.toLowerCase();
    const filtered: JdsAutocompleteGroup[] = ALL_DATA
      .map(group => ({
        ...group,
        items: group.items.filter(
          item => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
        ),
      }))
      .filter(group => group.items.length > 0);

    this.groupedSuggestions.set(filtered);
    const total = filtered.reduce((sum, g) => sum + g.items.length, 0);
    this.groupedTotalCount.set(total > 5 ? total : null);
  }

  onGroupedSelect(item: JdsAutocompleteItem): void {
    this.groupedSelected.set(item);
    this.groupedLastEvent.set(`Selected: ${item.label} (${item.id})`);
  }

  onGroupedShowAll(event: { query: string }): void {
    this.groupedLastEvent.set(`Show all clicked for: "${event.query}"`);
  }

  onGroupedClear(): void {
    this.groupedSelected.set(null);
    this.groupedLastEvent.set('Cleared');
  }

  onFlatSearch(event: { query: string }): void {
    const q = event.query.toLowerCase();
    this.flatSuggestions.set(
      FLAT_DATA.filter(
        item => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
      )
    );
  }

  onFlatSelect(item: JdsAutocompleteItem): void {
    this.flatSelected.set(item);
    this.flatLastEvent.set(`Selected: ${item.label} (${item.id})`);
  }

  onFlatClear(): void {
    this.flatSelected.set(null);
    this.flatLastEvent.set('Cleared');
  }
}

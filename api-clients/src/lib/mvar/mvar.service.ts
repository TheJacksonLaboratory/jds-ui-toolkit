import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map, Observable, tap } from "rxjs";

import { MUS_CHRS, SequenceOntologyTerm, SNP, SNPSearchRegion, Variant, VariantResults } from './models/response/dtos';

@Injectable({
  providedIn: 'root'
})
export class MVarService {

  private api;

  sequenceOntologyMapping: Record<string, SequenceOntologyTerm> = {};

  private soTerms: BehaviorSubject<SequenceOntologyTerm[]> = new BehaviorSubject(<SequenceOntologyTerm[]>[]);
  soTerms$: Observable<SequenceOntologyTerm[]> = this.soTerms.asObservable();

  constructor(private http: HttpClient, @Inject('environment') private environment: any) {
    this.api = environment.unsecuredURLs.mvar;

    // create a sequence ontology lookup
    this.getSequenceOntologyTerms().subscribe((terms) => {
      terms.forEach((t) => {
        if (t.label) {
          this.sequenceOntologyMapping[t.label] = t;
        }
      });
    });
  }

  /**
   * Gets Variants from mvar for a given set snp regions
   * @param regions Array of snp regions
   * @param pageStart snp start location
   * @param pageEnd snp end location
   * @param assembly Desired assembly version. Acceptable values are 'mm10' (GRCm38) and 'mm39' (GRCm39)
   */
  getVariants(regions: SNPSearchRegion[], pageStart: SNP, pageEnd: SNP, assembly: string): Observable<Variant[]> {
    return combineLatest(
      this.getRegionsToRequestVariantsFor(regions, pageStart, pageEnd).map((r) => {
        return this.http.get<VariantResults>(
          `${this.api}/variant/query?chr=${r.chromosome}&startPos=${r.start_position}&endPos=${r.end_position}&max=8000&assembly=${assembly}`,
        );
      }),
    ).pipe(
      map((variants: VariantResults[]) => {
        const allVariants = variants.map((v) => v.variants).flat();
        allVariants.forEach((variant: Variant) => {
          const classCodes = variant.functionalClassCode.split(',')[0];
          // add the ontology term
          variant.functionalClasses = classCodes.split('&').map((c) => this.sequenceOntologyMapping[c]);
        });
        return allVariants;
      }),
    );
  }

  /**
   * Returns all sequence ontology terms in MVAR
   */
  getSequenceOntologyTerms(): Observable<SequenceOntologyTerm[]> {
    return this.http
      .get<SequenceOntologyTerm[]>(`${this.api}/sequenceOntology/query?max=3000`)
      .pipe(tap((terms) => this.soTerms.next(terms)));
  }

  /**
   * Translates the regions requested from MUSter and the regions actually displayed on the current page into
   * regions to request from MVAR
   * @param requestedRegions - regions included in the request to MUSter
   * @param pageStart - first SNP from the sorted results from MUSter to display in the table
   * @param pageEnd - last SNP from the sorted results from MUSter to display in the table
   */
  getRegionsToRequestVariantsFor(
    requestedRegions: SNPSearchRegion[],
    pageStart: SNP,
    pageEnd: SNP,
  ): SNPSearchRegion[] {
    const displayStartBP = pageStart.start_position || 0;
    const displayEndBP = pageEnd.start_position || 0;
    const regionsByChr: Record<string, SNPSearchRegion[]> = {};
    requestedRegions.forEach((r) => {
      if (regionsByChr[r.chromosome]) {
        regionsByChr[r.chromosome].push(r);
      } else {
        regionsByChr[r.chromosome] = [r];
      }
    });

    const displayedRegions: SNPSearchRegion[] = [];
    if (pageStart.chr === pageEnd.chr) {
      regionsByChr[pageStart.chr].forEach((r) => {
        if (r.start_position <= displayEndBP && r.end_position >= displayStartBP) {
          displayedRegions.push({
            chromosome: r.chromosome,
            start_position: Math.max(r.start_position, displayStartBP),
            end_position: Math.min(r.end_position, displayEndBP),
          });
        }
      });
    } else {
      const displayedChrs = Object.keys(regionsByChr).filter(
        (r) =>
          MUS_CHRS.indexOf(r) >= MUS_CHRS.indexOf(pageStart.chr) &&
          MUS_CHRS.indexOf(r) <= MUS_CHRS.indexOf(pageEnd.chr),
      );

      displayedChrs.forEach((chr) => {
        regionsByChr[chr].forEach((r) => {
          if (r.end_position >= displayStartBP && chr === pageStart.chr) {
            displayedRegions.push({
              chromosome: r.chromosome,
              start_position: Math.max(r.start_position, displayStartBP),
              end_position: r.end_position,
            });
          } else if (r.start_position <= displayEndBP && chr === pageEnd.chr) {
            displayedRegions.push({
              chromosome: r.chromosome,
              start_position: r.start_position,
              end_position: Math.min(r.end_position, displayEndBP),
            });
          } else if (chr !== pageStart.chr && chr !== pageEnd.chr) {
            displayedRegions.push({
              chromosome: r.chromosome,
              start_position: r.start_position,
              end_position: r.end_position,
            });
          }
        });
      });
    }

    return displayedRegions;
  }
}

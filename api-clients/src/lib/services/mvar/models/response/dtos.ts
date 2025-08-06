export interface VariantResults {
  variantCount: number;
  variants: Variant[];
}

export interface Variant {
  accession: string;
  alt: string;
  aminoAcidChange: string;
  assembly: string;
  canonVarIdentifier: {
    caID: string;
    id: number;
    variantRefTxt: string;
  };
  chr: string;
  dnaHgvsNotation: string;
  functionalClassCode: string;
  functionalClasses: SequenceOntologyTerm[]; // added artificially
  gene: {
    chr: string;
    description: string;
    ensemblGeneId: string;
    entrezGeneId: string;
    id: number;
    mgiId: string;
    name: string;
    symbol: string;
    synonyms: {
      id: number;
    }[];
    transcripts: {
      id: number;
    }[];
    type: string;
  };
  id: number;
  impact: string;
  parentRefInd: boolean;
  position: number;
  proteinHgvsNotation: string;
  proteinPosition: string;
  ref: string;
  sources: {
    id: number;
    name: string;
    sourceVersion: string;
    url: string;
  }[];
  transcripts: {
    description: string;
    geneSymbol: string;
    id: number;
    mRnaId: string;
    primaryIdentifier: string;
  }[];
  type: string;
  variantHgvsNotation: string;
  variantRefTxt: string;
}

export interface SequenceOntologyTerm {
  definition: string;
  id: number;
  label: string;
  soId: string;
  subClassOf: string;
  mpdTerm: string;
}


export interface SNP {
  alternate_bases: string;
  calls: Call[];
  chr: string;
  observed: string;
  reference_base: string;
  rs: string;
  start_position: number | null; // allow for null value for gutter row
  annotation?: Variant | null;
}

export interface Call {
  strain_name: string;
  sample_id: number;
  genotype: string;
  prob: number;
  base: string;
}

export interface SNPSearchRegion {
  chromosome: string;
  start_position: number;
  end_position: number;
  reference_base?: string;
  alternate_base?: string;
}

// TODO - move to constants file/library
export const MUS_CHRS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  'X',
  'Y',
];

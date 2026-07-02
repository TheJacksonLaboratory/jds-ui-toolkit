export interface ComponentDoc {
  name: string;
  slug: string;
  description: string;
  status: 'stable' | 'in-progress' | 'deprecated';
  tags: string[];
  isAuthRequired: boolean;
  contact: string;
  group: 'components' | 'services';
  overview: {
    summary: string;
    docsUrl?: string;
  };
  variations: VariationDoc[];
  usage: UsageDoc;
  api: ApiDoc;
}

export interface VariationDoc {
  id: string;
  title: string;
  description: string;
  code: string;
  language: 'html' | 'typescript';
}

export interface UsageDoc {
  summary: string;
  dos: string[];
  donts: string[];
}

export interface ApiDoc {
  inputs: ApiProp[];
  outputs: ApiProp[];
}

export interface ApiProp {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}

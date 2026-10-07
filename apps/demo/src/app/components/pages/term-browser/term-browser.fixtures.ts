import { OntologyTerm } from '@jax-data-science/api-clients';

/**
 * Captured from ontology-service so the page renders without a backend.
 *
 * Arachnodactyly is reached by eight distinct routes through HPO, which is the case the
 * merge rule exists for; Hypertension is reached by one and has children to expand.
 */
export const ARACHNODACTYLY_FOCUS: OntologyTerm = {"id": "HP:0001166", "name": "Arachnodactyly", "descendantCount": 0};
export const ARACHNODACTYLY_ANCESTORS: OntologyTerm[] = [
  {
    "id": "HP:0011844",
    "name": "Abnormal appendicular skeleton morphology",
    "descendantCount": 2606,
    "parents": [
      "HP:0011842"
    ]
  },
  {
    "id": "HP:0011297",
    "name": "Abnormal digit morphology",
    "descendantCount": 1642,
    "parents": [
      "HP:0002813"
    ]
  },
  {
    "id": "HP:0001167",
    "name": "Abnormal finger morphology",
    "descendantCount": 864,
    "parents": [
      "HP:0001155",
      "HP:0011297"
    ]
  },
  {
    "id": "HP:0002813",
    "name": "Abnormal limb bone morphology",
    "descendantCount": 2416,
    "parents": [
      "HP:0011844",
      "HP:0040068"
    ]
  },
  {
    "id": "HP:0011842",
    "name": "Abnormal skeletal morphology",
    "descendantCount": 3836,
    "parents": [
      "HP:0000924"
    ]
  },
  {
    "id": "HP:0040068",
    "name": "Abnormality of limb bone",
    "descendantCount": 2417,
    "parents": [
      "HP:0000924",
      "HP:0040064"
    ]
  },
  {
    "id": "HP:0040064",
    "name": "Abnormality of limbs",
    "descendantCount": 2997,
    "parents": [
      "HP:0000118"
    ]
  },
  {
    "id": "HP:0001155",
    "name": "Abnormality of the hand",
    "descendantCount": 1170,
    "parents": [
      "HP:0002817"
    ]
  },
  {
    "id": "HP:0033127",
    "name": "Abnormality of the musculoskeletal system",
    "descendantCount": 4718,
    "parents": [
      "HP:0000118"
    ]
  },
  {
    "id": "HP:0000924",
    "name": "Abnormality of the skeletal system",
    "descendantCount": 3927,
    "parents": [
      "HP:0033127"
    ]
  },
  {
    "id": "HP:0002817",
    "name": "Abnormality of the upper limb",
    "descendantCount": 1597,
    "parents": [
      "HP:0040064"
    ]
  },
  {
    "id": "HP:0000001",
    "name": "All",
    "descendantCount": 19388,
    "parents": []
  },
  {
    "id": "HP:0100807",
    "name": "Long fingers",
    "descendantCount": 3,
    "parents": [
      "HP:0001167"
    ]
  },
  {
    "id": "HP:0000118",
    "name": "Phenotypic abnormality",
    "descendantCount": 18689,
    "parents": [
      "HP:0000001"
    ]
  },
  {
    "id": "HP:0001238",
    "name": "Slender finger",
    "descendantCount": 1,
    "parents": [
      "HP:0001167"
    ]
  }
];

export const HYPERTENSION_FOCUS: OntologyTerm = {"id": "HP:0000822", "name": "Hypertension", "descendantCount": 7};
export const HYPERTENSION_ANCESTORS: OntologyTerm[] = [
  {
    "id": "HP:0011025",
    "name": "Abnormal cardiovascular system physiology",
    "descendantCount": 424,
    "parents": [
      "HP:0001626"
    ]
  },
  {
    "id": "HP:0030972",
    "name": "Abnormal systemic blood pressure",
    "descendantCount": 28,
    "parents": [
      "HP:0011025"
    ]
  },
  {
    "id": "HP:0001626",
    "name": "Abnormality of the cardiovascular system",
    "descendantCount": 1480,
    "parents": [
      "HP:0000118"
    ]
  },
  {
    "id": "HP:0000001",
    "name": "All",
    "descendantCount": 19388,
    "parents": []
  },
  {
    "id": "HP:0032263",
    "name": "Increased blood pressure",
    "descendantCount": 14,
    "parents": [
      "HP:0030972"
    ]
  },
  {
    "id": "HP:0000118",
    "name": "Phenotypic abnormality",
    "descendantCount": 18689,
    "parents": [
      "HP:0000001"
    ]
  }
];

export const HYPERTENSION_CHILDREN: OntologyTerm[] = [
  {
    "id": "HP:0000875",
    "name": "Episodic hypertension",
    "descendantCount": 0
  },
  {
    "id": "HP:0002640",
    "name": "Hypertension associated with pheochromocytoma",
    "descendantCount": 1
  },
  {
    "id": "HP:0430034",
    "name": "Hypertension resistant to conventional therapy",
    "descendantCount": 0
  },
  {
    "id": "HP:0100735",
    "name": "Hypertensive crisis",
    "descendantCount": 0
  },
  {
    "id": "HP:6000321",
    "name": "Labile Hypertension",
    "descendantCount": 0
  },
  {
    "id": "HP:0100817",
    "name": "Renovascular hypertension",
    "descendantCount": 0
  }
];

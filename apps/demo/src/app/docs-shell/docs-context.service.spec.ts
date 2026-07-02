import { TestBed } from '@angular/core/testing';
import { DocsContextService } from './docs-context.service';
import { ComponentDoc } from '@jax-data-science/component-docs';

const mockDoc: ComponentDoc = {
  name: 'Test', slug: 'test', description: '', status: 'stable',
  tags: [], isAuthRequired: false, contact: '', group: 'components',
  overview: { summary: '' },
  variations: [],
  usage: { summary: '', dos: [], donts: [] },
  api: { inputs: [], outputs: [] },
};

describe('DocsContextService', () => {
  let service: DocsContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocsContextService);
  });

  it('initializes with null', () => {
    expect(service.currentDoc()).toBeNull();
  });

  it('setCurrentDoc updates the signal', () => {
    service.setCurrentDoc(mockDoc);
    expect(service.currentDoc()?.slug).toBe('test');
  });

  it('setCurrentDoc accepts null', () => {
    service.setCurrentDoc(mockDoc);
    service.setCurrentDoc(null);
    expect(service.currentDoc()).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';
import { DocsContextService } from './docs-context.service';
import { ComponentDoc } from '@jax-data-science/component-docs';

const mockDoc: ComponentDoc = {
  name: 'Test', slug: 'test', category: 'Utilities', description: '', status: 'stable',
  tags: [], isAuthRequired: false, contact: '', compodocSymbol: 'TestComponent',
  variations: [],
  usage: { summary: '', dos: [], donts: [] },
  theming: [],
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

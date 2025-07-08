import { TestBed } from '@angular/core/testing';

import { MVarService } from './mvar.service';
import { provideHttpClient } from '@angular/common/http';

describe('MVarService', () => {
  let service: MVarService;
  const mockEnvironment = {
    unsecuredURLs: {
      mvar: 'https://mvar.jax.org/mvar'
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: 'environment', useValue: mockEnvironment }
      ]
    });
    service = TestBed.inject(MVarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

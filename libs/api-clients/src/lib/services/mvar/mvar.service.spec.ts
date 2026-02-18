import { TestBed } from '@angular/core/testing';

import { MVarService } from './mvar.service';
import { provideHttpClient } from '@angular/common/http';
import { MVAR_SERVICE_CONFIG } from '../../tokens/mvar-config.token';

describe('MVarService', () => {
  let service: MVarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: MVAR_SERVICE_CONFIG, useValue: { apiUrl: 'https://mvar.jax.org/mvar' } }
      ]
    });
    service = TestBed.inject(MVarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

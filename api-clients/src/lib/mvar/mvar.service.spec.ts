import { TestBed } from '@angular/core/testing';

import { MVarService } from './mvar.service';

describe('MVarService', () => {
  let service: MVarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MVarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

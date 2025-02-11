import { TestBed } from '@angular/core/testing';

import { AsyncTasksService } from './async-tasks.service';

describe('AsyncTasksService', () => {
  let service: AsyncTasksService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AsyncTasksService],
    });

    service = TestBed.inject(AsyncTasksService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
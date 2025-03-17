import { TestBed } from '@angular/core/testing';
import { AsyncTaskFacade } from './asynctask.facade';

describe('AsyncTaskFacade', () => {
  let facade: AsyncTaskFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AsyncTaskFacade],
    });

    facade = TestBed.inject(AsyncTaskFacade);
  });

  it('should create', () => {
    expect(facade).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { AsyncTasksFacade } from './async-tasks.facade';

describe('AsyncTasksFacade', () => {
  let facade: AsyncTasksFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AsyncTasksFacade],
    });

    facade = TestBed.inject(AsyncTasksFacade);
  });

  it('should create', () => {
    expect(facade).toBeTruthy();
  });
});

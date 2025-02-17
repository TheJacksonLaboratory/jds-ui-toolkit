import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseAuthComponent } from './showcase-auth.component';

describe('ShowcaseAuthComponent', () => {
  let component: ShowcaseAuthComponent;
  let fixture: ComponentFixture<ShowcaseAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseAuthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

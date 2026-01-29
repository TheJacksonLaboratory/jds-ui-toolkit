import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressWidgetComponent } from './progress-widget.component';

describe('ProgressWidgetComponent', () => {
  let component: ProgressWidgetComponent;
  let fixture: ComponentFixture<ProgressWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct default input values', () => {
    expect(component.isLoading()).toBe(true);
    expect(component.statusMessage()).toBe('');
    expect(component.spinnerSize()).toBe(5);
    expect(component.blockUi()).toBe(false);
    expect(component.iconClass()).toBe('');
    expect(component.iconLeft()).toBe(false);
  });

  it('should compute sizeObject correctly based on spinnerSize', () => {
    expect(component.sizeObject()).toEqual({ width: '5rem', height: '5rem' });
  });

  it('should respond to input value changes', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('statusMessage', 'Loading data...');
    fixture.componentRef.setInput('blockUi', true);
    fixture.componentRef.setInput('iconClass', 'custom-icon');
    fixture.componentRef.setInput('iconLeft', true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.statusMessage()).toBe('Loading data...');
    expect(component.blockUi()).toBe(true);
    expect(component.iconClass()).toBe('custom-icon');
    expect(component.iconLeft()).toBe(true);
  });

  it('should display status message when provided', () => {
    fixture.componentRef.setInput('statusMessage', 'Processing...');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Processing...');
  });
});

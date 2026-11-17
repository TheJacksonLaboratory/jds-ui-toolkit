import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';

/** Test host that projects a button into the navbar's `jdsNavbarEnd` slot. */
@Component({
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <lib-jds-navbar [externalLink]="link">
      <button jdsNavbarEnd data-testid="end-btn">Clip</button>
    </lib-jds-navbar>
  `,
})
class ProjectedHostComponent {
  link = 'https://x.org';
}

/** Test host with no projected content, to confirm the default end area is unchanged. */
@Component({
  standalone: true,
  imports: [NavbarComponent],
  template: `<lib-jds-navbar externalLink="https://x.org"></lib-jds-navbar>`,
})
class PlainHostComponent {}

describe('NavbarComponent end slot', () => {
  beforeAll(() => {
    // jsdom has no matchMedia; PrimeNG's Menubar queries it for its responsive breakpoint.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectedHostComponent, PlainHostComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();
  });

  it('renders projected [jdsNavbarEnd] content in the menubar end area', () => {
    const fixture = TestBed.createComponent(ProjectedHostComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.p-menubar-end [data-testid="end-btn"]')).toBeTruthy();
  });

  it('places projected content before the external link', () => {
    const fixture = TestBed.createComponent(ProjectedHostComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const btn = el.querySelector('.p-menubar-end [data-testid="end-btn"]');
    const link = el.querySelector('.p-menubar-end a[href="https://x.org"]');
    expect(btn).toBeTruthy();
    expect(link).toBeTruthy();
    expect(btn!.compareDocumentPosition(link!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders unchanged without projected content', () => {
    const fixture = TestBed.createComponent(PlainHostComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.p-menubar-end a[href="https://x.org"]')).toBeTruthy();
    expect(el.querySelector('.p-menubar-end [jdsNavbarEnd]')).toBeNull();
  });
});

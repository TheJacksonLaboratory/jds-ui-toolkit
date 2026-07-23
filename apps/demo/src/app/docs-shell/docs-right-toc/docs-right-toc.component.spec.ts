import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsRightTocComponent } from './docs-right-toc.component';
import { ComponentDoc } from '@jax-data-science/component-docs';

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  static latest(): FakeIntersectionObserver {
    const observer = FakeIntersectionObserver.instances[FakeIntersectionObserver.instances.length - 1];
    if (!observer) throw new Error('No FakeIntersectionObserver has been created yet.');
    return observer;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();

  /** Fires an intersection batch as the browser would during/after a scroll. */
  emit(states: Record<string, boolean>): void {
    const entries = Object.entries(states).map(([id, isIntersecting]) => ({
      target: document.getElementById(id),
      isIntersecting,
    }));
    this.callback(
      entries as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver
    );
  }
}

describe('DocsRightTocComponent', () => {
  let component: DocsRightTocComponent;
  let fixture: ComponentFixture<DocsRightTocComponent>;
  let sectionEls: HTMLElement[];

  const doc: ComponentDoc = {
    name: 'Widget Error',
    slug: 'error-widget',
    category: 'Messaging',
    status: 'in-progress',
    tags: [],
    isAuthRequired: false,
    contact: 'npm@jax.org',
    compodocSymbol: 'WidgetErrorComponent',
    description: '',
    variations: [
      { id: 'default', title: 'Default', description: '', language: 'html' },
      { id: 'long-message', title: 'Long Message', description: '', language: 'html' },
    ],
    usage: { summary: '', dos: [], donts: [] },
    activity: { summary: '' },
    theming: [],
  };

  beforeEach(async () => {
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      FakeIntersectionObserver;
    FakeIntersectionObserver.instances = [];

    sectionEls = ['summary', 'default', 'long-message', 'usage', 'activity'].map((id) => {
      const el = document.createElement('div');
      el.id = id;
      el.scrollIntoView = jest.fn();
      document.body.appendChild(el);
      return el;
    });

    await TestBed.configureTestingModule({
      imports: [DocsRightTocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsRightTocComponent);
    component = fixture.componentInstance;
    component.doc = doc;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  afterEach(() => {
    sectionEls.forEach((el) => el.remove());
  });

  it('keeps a clicked item active when the resulting scroll cannot fully isolate it from an earlier section', () => {
    // User clicks the last TOC entry ("Component Activity").
    component.scrollTo('activity', new Event('click'));
    expect(component.activeId()).toBe('activity');

    // The page is short, so the smooth scroll can't push "activity" far enough
    // to leave the observer's band clear of the previous section — the browser
    // reports "summary" still intersecting and "activity" not yet intersecting.
    const observer = FakeIntersectionObserver.latest();
    observer.emit({ summary: true, activity: false });

    expect(component.activeId()).toBe('activity');
  });

  it('resumes normal tracking once the clicked target itself is confirmed intersecting', () => {
    component.scrollTo('activity', new Event('click'));
    const observer = FakeIntersectionObserver.latest();

    observer.emit({ summary: true, activity: false });
    expect(component.activeId()).toBe('activity');

    // The scroll finishes arriving: the clicked target now intersects too.
    observer.emit({ summary: false, activity: true });
    expect(component.activeId()).toBe('activity');

    // Guard is released — real scrolling should update the highlight again.
    observer.emit({ activity: false, usage: true });
    expect(component.activeId()).toBe('usage');
  });

  it('releases the guard after the settle timeout even if the clicked target never intersects', () => {
    jest.useFakeTimers();
    try {
      component.scrollTo('activity', new Event('click'));
      const observer = FakeIntersectionObserver.latest();

      observer.emit({ summary: true, activity: false });
      expect(component.activeId()).toBe('activity');

      jest.advanceTimersByTime(600);

      observer.emit({ summary: true, activity: false });
      expect(component.activeId()).toBe('summary');
    } finally {
      jest.useRealTimers();
    }
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { vi } from 'vitest';
import { resetLocalStorage } from '../../core/testing-storage';
import { EventStore } from '../../core/event.store';
import { I18n } from '../../core/i18n.service';
import { routes } from '../../app.routes';

describe('EventsComponent', () => {
  let harness: RouterTestingHarness;
  let store: EventStore;

  beforeEach(async () => {
    resetLocalStorage();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    TestBed.inject(I18n).setLanguage('fr');
    store = TestBed.inject(EventStore);
    harness = await RouterTestingHarness.create('/admin/events');
  });

  const el = (): HTMLElement => harness.routeNativeElement as HTMLElement;

  it('lists events and creates one with the button', async () => {
    expect(el().querySelectorAll('.event-item')).toHaveLength(0);
    el().querySelector<HTMLButtonElement>('.create-button')!.click();
    harness.detectChanges();
    const input = el().querySelector<HTMLInputElement>('#event-name')!;
    input.value = 'Rally';
    input.dispatchEvent(new Event('input'));
    el().querySelector<HTMLFormElement>('.create-form')!.requestSubmit();
    await harness.fixture.whenStable();

    expect(store.events().map(({ name }) => name)).toEqual(['Rally']);
  });

  it('creates an event with the resume option only when checked', () => {
    el().querySelector<HTMLButtonElement>('.create-button')!.click();
    harness.detectChanges();
    const input = el().querySelector<HTMLInputElement>('#event-name')!;
    input.value = 'Off';
    input.dispatchEvent(new Event('input'));
    el().querySelector<HTMLFormElement>('.create-form')!.requestSubmit();
    harness.detectChanges();
    expect(store.events()[0].resumeEnabled).toBe(false);

    el().querySelector<HTMLButtonElement>('.create-button')!.click();
    harness.detectChanges();
    el().querySelector<HTMLInputElement>('#event-name')!.value = 'On';
    el().querySelector<HTMLInputElement>('#event-name')!.dispatchEvent(new Event('input'));
    const toggle = el().querySelector<HTMLButtonElement>('button[name="eventResumeEnabled"]')!;
    toggle.click();
    harness.detectChanges();
    expect(toggle.getAttribute('role')).toBe('switch');
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    expect(toggle.title).toBe('Afficher le bouton Reprendre');
    el().querySelector<HTMLFormElement>('.create-form')!.requestSubmit();

    expect(store.find(store.events()[1].id)?.resumeEnabled).toBe(true);
    expect(store.events().map(({ resumeEnabled }) => resumeEnabled)).toEqual([false, true]);
  });

  it('joins an event by code and rejects invalid codes', () => {
    expect(store.join('x')).toBeNull();
    expect(store.join('abc123')?.id).toBe('abc123');
    expect(store.events()).toHaveLength(0);
  });

  it('shows the event name without displaying its code', () => {
    const event = store.create('Tournoi')!;
    harness.detectChanges();
    expect(el().querySelector('[gaia-event-card] strong')?.textContent).toBe('Tournoi');
    expect(el().textContent).not.toContain(event.id);
    expect(el().querySelector('a.event-link')?.getAttribute('href')).toContain(event.id);
  });

  it('deletes a single event', () => {
    vi.stubGlobal('confirm', () => true);
    store.create('A');
    const b = store.create('B')!;
    harness.detectChanges();

    el().querySelectorAll<HTMLButtonElement>('.delete-button')[0].click();
    harness.detectChanges();

    expect(store.events().map(({ id }) => id)).toEqual([b.id]);
    expect(el().querySelectorAll('.event-item')).toHaveLength(1);
  });

  it('keeps the event when deletion is cancelled', () => {
    vi.stubGlobal('confirm', () => false);
    store.create('Tournoi');
    harness.detectChanges();
    el().querySelector<HTMLButtonElement>('.delete-button')!.click();
    expect(store.events()).toHaveLength(1);
  });

  it('hides the delete action in read-only mode while keeping the event link', async () => {
    store.create('Tournoi');
    await harness.navigateByUrl('/view/events');
    expect(el().querySelector('.delete-button')).toBeNull();
    expect(el().querySelector('a.event-link')?.getAttribute('href')).toContain('/rox/view/events/');
  });
});

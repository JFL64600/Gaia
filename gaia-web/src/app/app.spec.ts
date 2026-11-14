import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { CHRONOMETER_REMOTE, ChronometerRemote } from './tools/rox/core/chronometer.tokens';
import { EVENTS_REMOTE, EventsRemote } from './tools/scores/core/events.remote';

const roxRemote: ChronometerRemote = {
  connect: (_id, onChange) => {
    onChange({ chronometers: [] });
    return () => undefined;
  },
  push: () => undefined,
  watchEvents: (onChange) => {
    onChange([{ id: 'event-123', name: 'Rox event', resumeEnabled: false }]);
    return () => undefined;
  },
};

const scoresRemote: EventsRemote = {
  watchGames: (onChange) => {
    onChange([]);
    return () => undefined;
  },
  watchEvents: (onChange) => {
    onChange([{ id: 'score-123', name: 'Scores event' }]);
    return () => undefined;
  },
  create: async () => 'score-123',
};

describe('Gaia navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: CHRONOMETER_REMOTE, useValue: roxRemote },
        { provide: EVENTS_REMOTE, useValue: scoresRemote },
      ],
    });
  });

  it('shares choices made on the home page and in the tools while keeping their styles', async () => {
    localStorage.setItem('gaiarox.theme', 'ocean');
    localStorage.setItem('gaiarox.language', 'eu');
    localStorage.setItem('gaiascores.theme', 'sunset');
    localStorage.setItem('gaiascores.language', 'fr');
    const harness = await RouterTestingHarness.create('/');
    const home = harness.routeNativeElement as HTMLElement;
    expect(home.textContent).toContain('GaiaScores');
    const brand = home.querySelector('gaia-brand')!;
    expect(brand.querySelectorAll('a')).toHaveLength(1);
    expect(brand.querySelector('a')?.textContent).toBe('G');
    expect(brand.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(document.documentElement.getAttribute('data-theme')).toBe('sunset');
    expect(document.documentElement.lang).toBe('fr');
    expect(Array.from(home.querySelectorAll('.preference-languages button'), (button) => button.getAttribute('lang')))
      .toEqual(['fr', 'eu']);
    home.querySelector<HTMLButtonElement>('.preference-languages button[lang="eu"]')!.click();
    home.querySelector<HTMLButtonElement>('.preference-trigger')!.click();
    harness.detectChanges();
    const options = home.querySelectorAll<HTMLButtonElement>('.preference-option');
    expect(options).toHaveLength(6);
    expect(Array.from(options).every((option) => !option.hasAttribute('title') && option.textContent === '')).toBe(true);
    home.querySelector<HTMLButtonElement>('.preference-option[aria-label="Ozeanoa"]')!.click();
    harness.detectChanges();
    expect(home.textContent).toContain('Aukeratu tresna bat.');

    await harness.navigateByUrl('/rox/admin/events');
    expect(harness.routeNativeElement?.querySelector('.gaia-brand > span')?.textContent).toBe('GaiaRox');
    expect(harness.routeNativeElement?.querySelectorAll('header a')).toHaveLength(1);
    expect(harness.routeNativeElement?.textContent).toContain('Rox event');
    expect(harness.routeNativeElement?.querySelector('a.event-link')?.getAttribute('href'))
      .toBe('/rox/admin/events/event-123');
    expect(harness.routeNativeElement?.querySelector('.create-button')).not.toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(document.documentElement.lang).toBe('eu');
    expect(document.head.querySelector('link[href$="styles/rox/styles.css"]')).not.toBeNull();

    await harness.navigateByUrl('/scores');
    expect(harness.routeNativeElement?.querySelector('.gaia-brand > span')?.textContent).toBe('GaiaScores');
    expect(harness.routeNativeElement?.querySelectorAll('header a')).toHaveLength(1);
    expect(harness.routeNativeElement?.textContent).toContain('Scores event');
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(document.documentElement.lang).toBe('eu');
    expect(document.head.querySelector('link[href$="styles/rox/styles.css"]')).toBeNull();
    expect(document.head.querySelector('link[href$="styles/scores/styles.css"]')).not.toBeNull();
    const scores = harness.routeNativeElement as HTMLElement;
    scores.querySelector<HTMLButtonElement>('.preference-languages button[lang="fr"]')!.click();
    scores.querySelector<HTMLButtonElement>('.preference-trigger')!.click();
    harness.detectChanges();
    scores.querySelector<HTMLButtonElement>('.preference-option[aria-label="Sombre"]')!.click();
    harness.detectChanges();

    await harness.navigateByUrl('/rox/view/events');
    expect(harness.routeNativeElement?.querySelector('.create-button')).toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.lang).toBe('fr');
    expect(document.head.querySelector('link[href$="styles/scores/styles.css"]')).toBeNull();
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.textContent).toContain('Choisissez un outil.');
    expect(localStorage.getItem('gaia.language')).toBe('fr');
    expect(localStorage.getItem('gaia.theme')).toBe('dark');
  });

  it('redirects old Rox event URLs to their integrated equivalent', async () => {
    const harness = await RouterTestingHarness.create('/view/events/event-123?source=share');
    expect(TestBed.inject(Router).url).toBe('/rox/view/events/event-123?source=share');
    expect(harness.routeNativeElement?.textContent).toContain('GaiaRox');
  });
});

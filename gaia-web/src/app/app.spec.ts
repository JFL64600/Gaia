import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { CHRONOMETER_REMOTE, ChronometerRemote } from './tools/rox/core/chronometer.tokens';
import { EVENTS_REMOTE, EventsRemote } from './tools/scores/core/events.remote';
import { DisplayModeService } from './preferences/display-mode.service';
import { ChronometerStore } from './tools/rox/core/chronometer.store';

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
    expect(home.textContent).not.toContain('Aukeratu tresna bat.');

    home.querySelector<HTMLButtonElement>('.preference-mode')!.click();
    harness.detectChanges();
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

    await harness.navigateByUrl('/');
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!.click();
    harness.detectChanges();
    await harness.navigateByUrl('/rox/view/events');
    expect(harness.routeNativeElement?.querySelector('.create-button')).toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.lang).toBe('fr');
    expect(document.head.querySelector('link[href$="styles/scores/styles.css"]')).toBeNull();
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.querySelector('main > h1')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('main > p')).toBeNull();
    expect(harness.routeNativeElement?.textContent).not.toContain('Choisissez un outil.');
    expect(localStorage.getItem('gaia.language')).toBe('fr');
    expect(localStorage.getItem('gaia.theme')).toBe('dark');
  });

  it('redirects old Rox event URLs to their integrated equivalent', async () => {
    const harness = await RouterTestingHarness.create('/view/events/event-123?source=share');
    expect(TestBed.inject(Router).url).toBe('/rox/view/events/event-123?source=share');
    expect(harness.routeNativeElement?.textContent).toContain('GaiaRox');
  });

  it('defaults to spectator on admin links and keeps event data across mode changes from home', async () => {
    const startInstant = Date.now() - 5000;
    let writes = 0;
    const remote: ChronometerRemote = {
      ...roxRemote,
      connect: (_id, onChange) => {
        onChange({
          chronometers: [{
            id: 'runner-1', name: 'Participant', status: 'running', startInstant, stopInstant: null,
          }],
        });
        return () => undefined;
      },
      push: () => { writes++; },
    };
    TestBed.overrideProvider(CHRONOMETER_REMOTE, { useValue: remote });
    localStorage.setItem('gaia.admin', 'true');
    const harness = await RouterTestingHarness.create('/rox/admin/events/event-123?source=share#ranking');
    const router = TestBed.inject(Router);
    expect(router.url).toBe('/rox/view/events/event-123?source=share#ranking');
    expect(harness.routeNativeElement?.querySelector('.preference-mode')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.add-tile')).toBeNull();

    await harness.navigateByUrl('/');
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!.click();
    await harness.navigateByUrl('/rox/view/events/event-123?source=share#ranking');
    expect(router.url).toBe('/rox/admin/events/event-123?source=share#ranking');
    expect(harness.routeNativeElement?.querySelector('.add-tile')).not.toBeNull();

    await harness.navigateByUrl('/');
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!.click();
    await harness.navigateByUrl('/rox/admin/events/event-123?source=share#ranking');
    expect(router.url).toBe('/rox/view/events/event-123?source=share#ranking');
    expect(harness.routeNativeElement?.querySelector('.add-tile')).toBeNull();
    expect(TestBed.inject(ChronometerStore).chronometers()).toMatchObject([
      { id: 'runner-1', status: 'running', startInstant },
    ]);
    expect(writes).toBe(0);
  });

  it('shares the mode across the portal and both tools without a separate admin card', async () => {
    const harness = await RouterTestingHarness.create('/');
    const home = harness.routeNativeElement!;
    expect(home.querySelectorAll('nav > a')).toHaveLength(2);
    const toggle = home.querySelector<HTMLButtonElement>('.preference-mode')!;
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    expect(toggle.title).toBe('Spectateur');
    expect(toggle.textContent?.trim()).toBe('');
    expect(toggle.getAttribute('aria-label')).toBe('Mode administrateur');
    expect(toggle.nextElementSibling?.classList.contains('preference-languages')).toBe(true);
    toggle.click();
    harness.detectChanges();
    expect(toggle.title).toBe('Administrateur');
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    expect(home.querySelector('nav > a')?.getAttribute('href')).toBe('/rox/admin');

    await harness.navigateByUrl('/scores');
    expect(harness.routeNativeElement?.querySelector('.preference-mode')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.create-button')).not.toBeNull();
    await harness.navigateByUrl('/rox');
    expect(harness.routeNativeElement?.querySelector('.preference-mode')).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/rox/admin/events');
    expect(harness.routeNativeElement?.querySelector('.create-button')).not.toBeNull();
    expect(TestBed.inject(DisplayModeService).admin()).toBe(true);

    await harness.navigateByUrl('/');
    const returnedToggle = harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!;
    expect(returnedToggle.title).toBe('Administrateur');
    returnedToggle.click();
    harness.detectChanges();
    expect(returnedToggle.title).toBe('Spectateur');
    await harness.navigateByUrl('/scores');
    expect(harness.routeNativeElement?.querySelector('.create-button')).toBeNull();
    expect(TestBed.inject(DisplayModeService).admin()).toBe(false);
  });
});

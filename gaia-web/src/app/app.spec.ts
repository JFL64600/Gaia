import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { CHRONOMETER_REMOTE, ChronometerRemote } from './tools/rox/core/chronometer.tokens';
import { EVENTS_REMOTE, EventsRemote } from './tools/scores/core/events.remote';
import { DisplayModeService } from './preferences/display-mode.service';
import { ChronometerStore } from './tools/rox/core/chronometer.store';
import { AXT_EVENTS_REMOTE, AxtEvent, AxtEventsRemote } from './tools/axt/core/events.remote';
import { vi } from 'vitest';

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
  remove: async () => undefined,
};

let axtEvents: AxtEvent[] = [];
const axtListeners = new Set<(events: readonly AxtEvent[]) => void>();
const axtRemote: AxtEventsRemote = {
  watchEvents: (onChange) => {
    axtListeners.add(onChange);
    onChange(axtEvents);
    return () => axtListeners.delete(onChange);
  },
  create: async (event) => {
    const id = 'axt-created';
    axtEvents = [...axtEvents, { id, ...event }];
    axtListeners.forEach((onChange) => onChange(axtEvents));
    return id;
  },
};

describe('Gaia navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    axtEvents = [{ id: 'axt-123', name: 'Andde Xoko', playerCount: 12 }];
    axtListeners.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: CHRONOMETER_REMOTE, useValue: roxRemote },
        { provide: EVENTS_REMOTE, useValue: scoresRemote },
        { provide: AXT_EVENTS_REMOTE, useValue: axtRemote },
      ],
    });
  });

  it('shares choices made on the home page and in the tools while keeping their styles', async () => {
    localStorage.setItem('gaia.theme', 'sunset');
    localStorage.setItem('gaia.language', 'fr');
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
    await harness.navigateByUrl('/rox/events');
    expect(harness.routeNativeElement?.querySelector('.gaia-brand-name')?.textContent).toBe('GaiaRox');
    expect(harness.routeNativeElement?.querySelectorAll('header a')).toHaveLength(2);
    expect(harness.routeNativeElement?.textContent).toContain('Rox event');
    expect(harness.routeNativeElement?.querySelector('a.event-link')?.getAttribute('href'))
      .toBe('/rox/events/event-123');
    expect(harness.routeNativeElement?.querySelector('.create-button')).not.toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(document.documentElement.lang).toBe('eu');
    expect(document.head.querySelector('link[href$="styles/rox/styles.css"]')).not.toBeNull();

    await harness.navigateByUrl('/scores');
    expect(harness.routeNativeElement?.querySelector('.gaia-brand-name')?.textContent).toBe('GaiaScores');
    expect(harness.routeNativeElement?.querySelectorAll('header a')).toHaveLength(2);
    expect(harness.routeNativeElement?.textContent).toContain('Scores event');
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(document.documentElement.lang).toBe('eu');
    expect(document.head.querySelector('link[href$="styles/rox/styles.css"]')).toBeNull();
    expect(document.head.querySelector('link[href$="styles/scores/styles.css"]')).not.toBeNull();
    await harness.navigateByUrl('/axt');
    expect(harness.routeNativeElement?.querySelector('.gaia-brand-name')?.textContent)
      .toBe('AnddeXokoTxapelketa');
    expect(harness.routeNativeElement?.textContent).toContain('Andde Xoko');
    expect(harness.routeNativeElement?.querySelector('a.event-link')?.getAttribute('href'))
      .toBe('/axt/events/axt-123');
    expect(document.head.querySelector('link[href$="styles/axt/styles.css"]')).not.toBeNull();
    const scores = harness.routeNativeElement as HTMLElement;
    scores.querySelector<HTMLButtonElement>('.preference-languages button[lang="fr"]')!.click();
    scores.querySelector<HTMLButtonElement>('.preference-trigger')!.click();
    harness.detectChanges();
    scores.querySelector<HTMLButtonElement>('.preference-option[aria-label="Sombre"]')!.click();
    harness.detectChanges();

    await harness.navigateByUrl('/');
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!.click();
    harness.detectChanges();
    await harness.navigateByUrl('/rox/events');
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

  it('navigates from each tool name to its start while G returns to the portal', async () => {
    const harness = await RouterTestingHarness.create('/rox/events/event-123?source=share#ranking');
    const router = TestBed.inject(Router);
    const roxName = harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.gaia-brand-name')!;
    expect(roxName.getAttribute('href')).toBe('/rox');
    roxName.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/rox/events');
    expect(harness.routeNativeElement?.textContent).toContain('Rox event');

    await harness.navigateByUrl('/scores?source=share#events');
    const scoresName = harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.gaia-brand-name')!;
    expect(scoresName.getAttribute('href')).toBe('/scores');
    scoresName.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/scores');

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.gaia-brand-mark')!.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/');
  });

  it('shows illustrated links with only the name of each tool', async () => {
    const harness = await RouterTestingHarness.create('/');
    const home = harness.routeNativeElement as HTMLElement;
    const links = Array.from(home.querySelectorAll<HTMLAnchorElement>('nav > a'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/scores', '/axt', '/rox']);
    expect(links.map((link) => link.querySelector('img')?.getAttribute('src')))
      .toEqual(['images/home-scores.svg', 'images/home-axt.svg', 'images/home-rox.svg']);
    expect(links.every((link) => link.querySelector('img')?.getAttribute('alt') === '')).toBe(true);
    expect(links.map((link) => link.querySelector('.tile-label')?.textContent?.trim()))
      .toEqual(['GaiaScores', 'AnddeXokoTxapelketa', 'GaiaRox']);
    expect(Array.from(links[1].querySelectorAll('.axt-label span'), (line) => line.textContent))
      .toEqual(['Andde', 'Xoko', 'Txapelketa']);
    home.querySelector<HTMLButtonElement>('.preference-languages button[lang="eu"]')!.click();
    harness.detectChanges();
    expect(home.querySelector('nav')?.getAttribute('aria-label')).toBe('Gaia tresnak');
    expect(links.map((link) => link.querySelector('.tile-label')?.textContent?.trim()))
      .toEqual(['GaiaScores', 'AnddeXokoTxapelketa', 'GaiaRox']);
  });

  it('creates an AXT event and exposes its shareable detail link', async () => {
    TestBed.inject(DisplayModeService).setAdmin(true);
    const harness = await RouterTestingHarness.create('/axt');
    const page = harness.routeNativeElement as HTMLElement;
    page.querySelector<HTMLButtonElement>('.create-button')!.click();
    harness.detectChanges();

    const name = page.querySelector<HTMLInputElement>('#event-name')!;
    name.value = '  Finala  ';
    name.dispatchEvent(new Event('input'));
    const playerCount = page.querySelector<HTMLInputElement>('#event-players')!;
    playerCount.value = '18';
    playerCount.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(page.querySelector<HTMLButtonElement>('.create-panel button[type="submit"]')?.disabled)
      .toBe(false);
    page.querySelector<HTMLButtonElement>('.create-panel button[type="submit"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(page.querySelector('.create-panel')).toBeNull();
    expect(axtEvents.at(-1)).toEqual({ id: 'axt-created', name: 'Finala', playerCount: 18 });
    expect(page.querySelector('a.event-link[href="/axt/events/axt-created"]')).not.toBeNull();
    await harness.navigateByUrl('/axt/events/axt-created');
    expect(harness.routeNativeElement?.querySelector('#event-title')?.textContent).toBe('Finala');
    expect(harness.routeNativeElement?.textContent).toContain('18');
    expect(harness.routeNativeElement?.querySelector('.share-link')?.getAttribute('href'))
      .toContain('/axt/events/axt-created');
    expect(axtEvents.at(-1)).toEqual({ id: 'axt-created', name: 'Finala', playerCount: 18 });
  });

  it('opens the shared event URL in spectator mode and ignores the old room parameter', async () => {
    const harness = await RouterTestingHarness.create('/rox/events/event-123?source=share&room=room-123#ranking');
    expect(TestBed.inject(Router).url).toBe('/rox/events/event-123?source=share&room=room-123#ranking');
    expect(harness.routeNativeElement?.textContent).toContain('GaiaRox');
    expect(TestBed.inject(DisplayModeService).admin()).toBe(false);
    expect(TestBed.inject(ChronometerStore).currentRoom()).toBe('event-123');
    expect(harness.routeNativeElement?.querySelector('.add-tile')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('#room-code')).toBeNull();
  });

  it.each([
    ['/admin/events/event-123', '/'],
    ['/view/events/event-123', '/'],
    ['/events/event-123', '/'],
    ['/rox/admin/events/event-123', '/rox/events'],
    ['/rox/view/events/event-123', '/rox/events'],
  ])('no longer opens an event from the old URL %s', async (path, destination) => {
    const harness = await RouterTestingHarness.create(path);
    expect(TestBed.inject(Router).url).toBe(destination);
    expect(TestBed.inject(ChronometerStore).currentRoom()).toBeNull();
    expect(harness.routeNativeElement?.querySelector('app-chronometers')).toBeNull();
  });

  it.each(['/rox', '/rox/events'])('opens %s at the common list URL in administrator mode', async (path) => {
    TestBed.inject(DisplayModeService).setAdmin(true);
    const harness = await RouterTestingHarness.create(`${path}?source=bookmark#events`);
    expect(TestBed.inject(Router).url).toBe('/rox/events?source=bookmark#events');
    expect(TestBed.inject(DisplayModeService).admin()).toBe(true);
    expect(harness.routeNativeElement?.querySelector('.create-button')).not.toBeNull();
  });

  it('still reports event synchronization failures after removing the room form', async () => {
    const remote: ChronometerRemote = {
      ...roxRemote,
      connect: (_id, onChange, onError) => {
        onChange({ chronometers: [] });
        onError?.(new Error('Disconnected'));
        return () => undefined;
      },
    };
    TestBed.overrideProvider(CHRONOMETER_REMOTE, { useValue: remote });
    const harness = await RouterTestingHarness.create('/rox/events/event-123');
    expect(harness.routeNativeElement?.querySelector('.sync-error[role="alert"]')?.textContent)
      .toContain('Synchronisation impossible');
    expect(harness.routeNativeElement?.querySelector('#room-code')).toBeNull();
  });

  it('defaults to spectator on shared links and keeps event data across mode changes from home', async () => {
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
    const harness = await RouterTestingHarness.create('/rox/events/event-123?source=share#ranking');
    const router = TestBed.inject(Router);
    expect(router.url).toBe('/rox/events/event-123?source=share#ranking');
    expect(harness.routeNativeElement?.querySelector('.preference-mode')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.add-tile')).toBeNull();

    await harness.navigateByUrl('/');
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!.click();
    await harness.navigateByUrl('/rox/events/event-123?source=share#ranking');
    expect(router.url).toBe('/rox/events/event-123?source=share#ranking');
    expect(harness.routeNativeElement?.querySelector('.add-tile')).not.toBeNull();

    await harness.navigateByUrl('/');
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!.click();
    await harness.navigateByUrl('/rox/events/event-123?source=share#ranking');
    expect(router.url).toBe('/rox/events/event-123?source=share#ranking');
    expect(harness.routeNativeElement?.querySelector('.add-tile')).toBeNull();
    expect(TestBed.inject(ChronometerStore).chronometers()).toMatchObject([
      { id: 'runner-1', status: 'running', startInstant },
    ]);
    expect(writes).toBe(0);
  });

  it('changes the event display in place without reconnecting or writing chronometers', async () => {
    let connections = 0;
    let writes = 0;
    const snapshot = {
      chronometers: [
        { id: 'runner-1', name: 'Running', status: 'running' as const, startInstant: Date.now(), stopInstant: null },
        { id: 'runner-2', name: 'Finished', status: 'stopped' as const, startInstant: 1000, stopInstant: 2000 },
      ],
    };
    TestBed.overrideProvider(CHRONOMETER_REMOTE, {
      useValue: {
        ...roxRemote,
        connect: (_id: string, onChange: (value: typeof snapshot) => void) => {
          connections++;
          onChange(snapshot);
          return () => undefined;
        },
        push: () => { writes++; },
      },
    });
    const harness = await RouterTestingHarness.create('/rox/events/event-123?source=share#ranking');
    const mode = TestBed.inject(DisplayModeService);
    const router = TestBed.inject(Router);
    const url = router.url;
    const store = TestBed.inject(ChronometerStore);
    const before = store.chronometers();
    expect(harness.routeNativeElement?.querySelectorAll('.chronometer-card')).toHaveLength(1);
    expect(harness.routeNativeElement?.querySelector('app-ranking')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('header .language-switch')).not.toBeNull();

    mode.setAdmin(true);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('.chronometer-card')).toHaveLength(2);
    expect(harness.routeNativeElement?.querySelector('app-ranking')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('header .language-switch')).toBeNull();
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.add-tile')!.click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('.name-form')).not.toBeNull();

    mode.setAdmin(false);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('.name-form')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.card-actions')).toBeNull();
    expect(harness.routeNativeElement?.querySelectorAll('.chronometer-card')).toHaveLength(1);
    expect(harness.routeNativeElement?.querySelector('app-ranking')).not.toBeNull();
    expect(router.url).toBe(url);
    expect(store.chronometers()).toEqual(before);
    expect(connections).toBe(1);
    expect(writes).toBe(0);

    mode.setAdmin(true);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('.name-form')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.add-tile')).not.toBeNull();
  });

  it('copies the same event URL in both modes, including the Pages base path', async () => {
    const href = 'https://example.test/Gaia/rox/events/event-123?source=share#ranking';
    vi.stubGlobal('location', { href });
    const writeText = vi.fn().mockResolvedValue(undefined);
    const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    try {
      const harness = await RouterTestingHarness.create('/rox/events/event-123?source=share#ranking');
      for (const admin of [false, true]) {
        TestBed.inject(DisplayModeService).setAdmin(admin);
        await harness.fixture.whenStable();
        harness.routeNativeElement!.querySelector<HTMLButtonElement>('header .copy-link')!.click();
        await harness.fixture.whenStable();
        expect(writeText).toHaveBeenLastCalledWith(href);
      }
    } finally {
      vi.unstubAllGlobals();
      if (clipboard) {
        Object.defineProperty(navigator, 'clipboard', clipboard);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  });

  it('shares the mode across the portal and all tools without a separate admin card', async () => {
    const harness = await RouterTestingHarness.create('/');
    const home = harness.routeNativeElement!;
    expect(home.querySelectorAll('nav > a')).toHaveLength(3);
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
    expect(home.querySelector('nav > a')?.getAttribute('href')).toBe('/scores');

    await harness.navigateByUrl('/scores');
    expect(harness.routeNativeElement?.querySelector('.preference-mode')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.create-button')).not.toBeNull();
    await harness.navigateByUrl('/rox');
    expect(harness.routeNativeElement?.querySelector('.preference-mode')).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/rox/events');
    expect(harness.routeNativeElement?.querySelector('.create-button')).not.toBeNull();
    expect(TestBed.inject(DisplayModeService).admin()).toBe(true);

    await harness.navigateByUrl('/');
    const returnedToggle = harness.routeNativeElement!.querySelector<HTMLButtonElement>('.preference-mode')!;
    expect(returnedToggle.title).toBe('Administrateur');
    returnedToggle.click();
    harness.detectChanges();
    expect(returnedToggle.title).toBe('Spectateur');
    await harness.navigateByUrl('/scores');
    expect(harness.routeNativeElement?.querySelector('.preference-mode')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.create-button')).toBeNull();
    expect(TestBed.inject(DisplayModeService).admin()).toBe(false);
  });
});

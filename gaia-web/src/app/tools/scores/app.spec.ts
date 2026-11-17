import { TestBed } from '@angular/core/testing';
import { EventStore, NewScoreEvent, ScoreEvent } from './core/event.store';
import { EVENTS_REMOTE, EventsRemote } from './core/events.remote';
import { Game } from './core/games';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { DisplayModeService } from '../../preferences/display-mode.service';
import { afterEach, vi } from 'vitest';
import { resetLocalStorage } from '../rox/core/testing-storage';

const GAMES: readonly Game[] = [
  { code: 'Arpana', label: 'Arpana', role: 'Time' },
  { code: 'Toka', label: 'Toka', role: 'Point' },
];

class MemoryEventsRemote implements EventsRemote {
  private events: ScoreEvent[] = [];
  private onEvents?: (events: readonly ScoreEvent[]) => void;
  failure?: Error;
  removeFailure?: Error;
  created: NewScoreEvent[] = [];
  removed: string[] = [];

  watchGames(onGames: (games: readonly Game[]) => void): () => void {
    onGames(GAMES);
    return () => undefined;
  }

  watchEvents(onEvents: (events: readonly ScoreEvent[]) => void): () => void {
    this.onEvents = onEvents;
    onEvents(this.events);
    return () => {
      this.onEvents = undefined;
    };
  }

  async create(event: NewScoreEvent): Promise<string> {
    if (this.failure) {
      throw this.failure;
    }
    this.created.push(event);
    const id = crypto.randomUUID();
    this.events = [...this.events, { id, name: event.name, teamCount: event.teamCount, gameIds: event.gameIds }];
    this.onEvents?.(this.events);
    return id;
  }

  async remove(id: string): Promise<void> {
    if (this.removeFailure) {
      throw this.removeFailure;
    }
    this.removed.push(id);
    this.events = this.events.filter((event) => event.id !== id);
    this.onEvents?.(this.events);
  }

  emitEvents(): void {
    this.onEvents?.(this.events);
  }
}

describe('App', () => {
  let remote: MemoryEventsRemote;

  beforeEach(async () => {
    resetLocalStorage();
    remote = new MemoryEventsRemote();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), { provide: EVENTS_REMOTE, useValue: remote }],
    }).compileComponents();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the events screen and supports event creation', async () => {
    TestBed.inject(DisplayModeService).setAdmin(true);
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Évènements');
    expect(compiled.querySelector('.empty-state h2')?.textContent).toContain(
      'Aucun évènement pour le moment',
    );
    expect(compiled.querySelector('.eyebrow, .page-description')).toBeNull();
    const search = compiled.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = 'absent';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.primary-button')!.click();
    fixture.detectChanges();
    const input = compiled.querySelector<HTMLInputElement>('#event-name')!;
    input.value = 'Tournoi Gaia';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const teams = compiled.querySelector<HTMLInputElement>('#event-teams')!;
    teams.value = '8';
    teams.dispatchEvent(new Event('input'));
    compiled.querySelectorAll<HTMLInputElement>('.game-option input')[0].click();
    compiled.querySelectorAll<HTMLInputElement>('.game-option input')[1].click();
    fixture.detectChanges();
    compiled.querySelector<HTMLFormElement>('.create-panel')!.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('[gaia-event-card] strong')?.textContent).toBe('Tournoi Gaia');
    expect(search.value).toBe('');
    const id = TestBed.inject(EventStore).events()[0].id;
    expect(id).toMatch(/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/);
    expect(compiled.textContent).not.toContain(id);
    expect(compiled.querySelector('.event-count')?.textContent).toContain('1 évènement');
    expect(TestBed.inject(EventStore).events()[0]).toMatchObject({
      teamCount: 8,
      gameIds: ['Arpana', 'Toka'],
    });
    const createdTeams = remote.created[0].teams;
    expect(createdTeams).toHaveLength(8);
    expect(createdTeams[0]).toEqual({ name: '1', gameIds: ['Arpana', 'Toka'] });
    expect(createdTeams[7].name).toBe('8');
  });

  it('switches between the two languages and available themes', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.preference-languages button[lang="eu"]')!.click();
    compiled.querySelector<HTMLButtonElement>('.preference-trigger')!.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('.preference-option[aria-label="Ozeanoa"]')!.click();
    fixture.detectChanges();

    expect(document.documentElement.lang).toBe('eu');
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(localStorage.getItem('gaia.language')).toBe('eu');
    expect(localStorage.getItem('gaia.theme')).toBe('ocean');
  });

  it('starts in spectator mode and discards an open form when admin is disabled', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const mode = TestBed.inject(DisplayModeService);
    expect(element.querySelector('.preference-mode')).toBeNull();
    expect(element.querySelector('.create-button')).toBeNull();

    mode.setAdmin(true);
    fixture.detectChanges();
    expect(mode.admin()).toBe(true);
    element.querySelector<HTMLButtonElement>('.create-button')!.click();
    fixture.detectChanges();
    expect(element.querySelector('.create-panel')).not.toBeNull();

    mode.setAdmin(false);
    fixture.detectChanges();
    expect(mode.admin()).toBe(false);
    expect(element.querySelector('.create-panel')).toBeNull();
    expect(element.querySelector('.create-button')).toBeNull();
    mode.setAdmin(true);
    fixture.detectChanges();
    expect(mode.admin()).toBe(true);
    expect(element.querySelector('.create-panel')).toBeNull();
    expect(remote.created).toHaveLength(0);
  });

  it('lets admins delete an event immediately when clicking the trash button', async () => {
    const mode = TestBed.inject(DisplayModeService);
    mode.setAdmin(true);
    const fixture = TestBed.createComponent(App);
    const store = TestBed.inject(EventStore);
    const event = await store.create('Tournoi Gaia', 2, ['Arpana']);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const confirm = vi.fn();
    vi.stubGlobal('confirm', confirm);
    element.querySelector<HTMLButtonElement>('.delete-button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(confirm).not.toHaveBeenCalled();
    expect(remote.removed).toEqual([event!.id]);
    expect(store.events()).toHaveLength(0);
    expect(element.querySelector('.empty-state h2')?.textContent).toContain(
      'Aucun évènement pour le moment',
    );
  });

  it('hides deletion for spectators and surfaces deletion errors', async () => {
    const store = TestBed.inject(EventStore);
    await store.create('Tournoi Gaia', 2, ['Arpana']);
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.delete-button')).toBeNull();

    const mode = TestBed.inject(DisplayModeService);
    mode.setAdmin(true);
    remote.removeFailure = new Error('permission-denied');
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('.delete-button')!.click();
    await fixture.whenStable();
    remote.emitEvents();
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('permission-denied');
    expect(store.events()).toHaveLength(1);
  });

  it('trims event names and ignores blank names', async () => {
    const store = TestBed.inject(EventStore);

    expect(await store.create('   ', 2, ['Arpana'])).toBeNull();
    expect((await store.create('  Spring Cup  ', 2, ['Arpana']))?.name).toBe('Spring Cup');
    expect(store.events()).toHaveLength(1);
  });

  it('surfaces event creation errors', async () => {
    const store = TestBed.inject(EventStore);
    remote.failure = new Error('permission-denied');

    expect(await store.create('Spring Cup', 2, ['Arpana'])).toBeNull();
    expect(store.error()).toBe('permission-denied');
  });

  it('rejects invalid team counts and an empty selection without saving', async () => {
    const store = TestBed.inject(EventStore);
    for (const count of [0, -1, 1.5, 101, NaN, Infinity]) {
      expect(await store.create('Cup', count, ['Arpana'])).toBeNull();
    }
    expect(await store.create('Cup', 2, [])).toBeNull();
    expect(await store.create('Cup', 2, ['Unknown'])).toBeNull();
    expect(await store.create('Cup', 2, ['Toka', 'Toka'])).toBeNull();
    expect(store.events()).toHaveLength(0);
    expect(await store.create('Cup', 1, ['Arpana'])).not.toBeNull();
  });
});

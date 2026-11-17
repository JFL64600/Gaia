import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GaiaBrand } from '../../gaia-brand';
import { DisplayModeService } from '../../preferences/display-mode.service';
import { PreferencesControls } from '../../preferences/preferences-controls';
import { attachToolStyles } from '../../tool-styles';
import { EventStore } from './core/event.store';
import { I18n } from './core/i18n.service';
import { ResultsRemote, ResultTeam } from './core/results.remote';
import { ResultEditor } from './result-editor';

@Component({
  imports: [GaiaBrand, PreferencesControls, ResultEditor],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
  protected readonly i18n = inject(I18n);
  protected readonly mode = inject(DisplayModeService);
  private readonly eventStore = inject(EventStore);
  private readonly remote = inject(ResultsRemote);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(DestroyRef);

  protected readonly eventId = signal('');
  protected readonly event = signal<{ name: string; gameIds: readonly string[] } | null>(null);
  protected readonly teams = signal<readonly ResultTeam[]>([]);
  protected readonly eventLoading = signal(true);
  protected readonly teamsLoading = signal(true);
  protected readonly eventError = signal<string | null>(null);
  protected readonly teamsError = signal<string | null>(null);
  protected readonly section = signal<'results' | 'ranking'>('results');
  protected readonly games = computed(() => {
    const byId = new Map(this.eventStore.games().map((game) => [game.code, game]));
    return (this.event()?.gameIds ?? []).flatMap((id) => {
      const game = byId.get(id);
      return game ? [game] : [];
    });
  });
  protected readonly missingGames = computed(() =>
    !this.eventStore.loading() && this.games().length !== (this.event()?.gameIds.length ?? 0),
  );
  protected readonly error = computed(() =>
    this.eventError() ?? this.teamsError() ?? this.eventStore.error(),
  );

  constructor() {
    attachToolStyles('styles/scores/styles.css', this.destroy);
    let stopEvent = () => {};
    let stopTeams = () => {};
    const routeSubscription = this.route.paramMap.subscribe((params) => {
      stopEvent();
      stopTeams();
      const id = params.get('id') ?? '';
      this.eventId.set(id);
      this.event.set(null);
      this.teams.set([]);
      this.eventLoading.set(true);
      this.teamsLoading.set(true);
      this.eventError.set(null);
      this.teamsError.set(null);
      this.section.set('results');
      stopEvent = this.remote.watchEvent(id, (value) => {
        this.event.set(value);
        this.eventLoading.set(false);
        this.eventError.set(null);
      }, (error) => {
        this.eventLoading.set(false);
        this.eventError.set(error instanceof Error ? error.message : String(error));
      });
      stopTeams = this.remote.watchTeams(id, (teams) => {
        this.teams.set(teams);
        this.teamsLoading.set(false);
        this.teamsError.set(null);
      }, (error) => {
        this.teamsLoading.set(false);
        this.teamsError.set(error instanceof Error ? error.message : String(error));
      });
    });
    this.destroy.onDestroy(() => {
      routeSubscription.unsubscribe();
      stopEvent();
      stopTeams();
    });
  }
}

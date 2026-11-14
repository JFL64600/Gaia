import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { EventStore, EVENT_NAME_MAX_LENGTH, MAX_TEAM_COUNT } from './core/event.store';
import { I18n } from './core/i18n.service';
import { attachToolStyles } from '../../tool-styles';
import { PreferencesControls } from '../../preferences/preferences-controls';
import { GaiaBrand } from '../../gaia-brand';
import { EventsPage } from '../../shared/events-page';

@Component({
  selector: 'app-scores',
  imports: [PreferencesControls, GaiaBrand, EventsPage],
  templateUrl: './app.html',
})
export class App {
  protected readonly i18n = inject(I18n);
  protected readonly eventStore = inject(EventStore);
  constructor() {
    attachToolStyles('styles/scores/styles.css', inject(DestroyRef));
  }
  protected readonly creating = signal(false);
  protected readonly pendingName = signal('');
  protected readonly searchTerm = signal('');
  protected readonly saving = signal(false);
  protected readonly games = this.eventStore.games;
  protected readonly pendingTeamCount = signal<number | null>(null);
  protected readonly pendingGameIds = signal<readonly string[]>([]);
  protected readonly validEvent = computed(() => {
    const count = this.pendingTeamCount();
    return !!this.pendingName().trim() && count !== null &&
      Number.isSafeInteger(count) && count > 0 && count <= MAX_TEAM_COUNT && this.pendingGameIds().length > 0;
  });
  protected startCreating(): void {
    this.pendingName.set('');
    this.pendingTeamCount.set(null);
    this.pendingGameIds.set([]);
    this.creating.set(true);
  }

  protected cancelCreating(): void {
    if (this.saving()) return;
    this.creating.set(false);
  }

  protected updateTeamCount(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pendingTeamCount.set(input.value === '' ? null : input.valueAsNumber);
  }

  protected toggleGame(id: string): void {
    this.pendingGameIds.update((ids) =>
      ids.includes(id) ? ids.filter((candidate) => candidate !== id) : [...ids, id],
    );
  }

  protected updatePendingName(event: Event): void {
    this.pendingName.set((event.target as HTMLInputElement).value.slice(0, EVENT_NAME_MAX_LENGTH));
  }

  protected async createEvent(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const teamCount = this.pendingTeamCount();
    if (!this.validEvent() || teamCount === null || this.saving()) return;
    this.saving.set(true);
    try {
      const created = await this.eventStore.create(
        this.pendingName(), teamCount, this.pendingGameIds(),
      );
      if (created) {
        this.creating.set(false);
        this.pendingName.set('');
        this.searchTerm.set('');
      }
    } finally {
      this.saving.set(false);
    }
  }

}

import { Component, computed, effect, inject, signal } from '@angular/core';
import { EventListItem, EventsPage } from '../../shared/events-page';
import { EventCreation } from '../../shared/event-creation';
import { DisplayModeService } from '../../preferences/display-mode.service';
import { PreferencesService } from '../../preferences/preferences.service';
import { AxtEventStore, EVENT_NAME_MAX_LENGTH } from './core/event.store';

const TEXT = {
  fr: {
    title: 'Nouvel évènement',
    description: 'Choisissez un nom et le nombre de joueurs.',
    name: 'Nom de l’évènement',
    placeholder: 'Ex. : Andde Xoko',
    players: 'Nombre de joueurs',
    playersHint: 'Saisissez un nombre entier supérieur à zéro.',
    add: 'Ajouter',
    cancel: 'Annuler',
    saving: 'Enregistrement…',
    open: 'Ouvrir {name}',
    player: 'joueur',
    playersPlural: 'joueurs',
  },
  eu: {
    title: 'Ekitaldi berria',
    description: 'Aukeratu izena eta jokalari kopurua.',
    name: 'Ekitaldiaren izena',
    placeholder: 'Adibidez: Andde Xoko',
    players: 'Jokalari kopurua',
    playersHint: 'Sartu zero baino handiagoa den zenbaki oso bat.',
    add: 'Gehitu',
    cancel: 'Utzi',
    saving: 'Gordetzen…',
    open: 'Ireki {name}',
    player: 'jokalari',
    playersPlural: 'jokalari',
  },
} as const;

@Component({
  imports: [EventsPage, EventCreation],
  template: `
    <main class="content">
      <gaia-events-page
        [events]="events()"
        [creating]="creating()"
        [canCreate]="mode.admin()"
        [loading]="eventStore.loading()"
        [error]="eventStore.error()"
        [(query)]="searchTerm"
        (create)="startCreating()"
      >
        @if (mode.admin() && creating()) {
          <gaia-event-creation
            [title]="text().title"
            [description]="text().description"
            [nameLabel]="text().name"
            [namePlaceholder]="text().placeholder"
            [nameMaxLength]="nameMaxLength"
            [nameValue]="pendingName()"
            [nameDisabled]="saving()"
            [focusName]="true"
            [submitLabel]="saving() ? text().saving : text().add"
            [cancelLabel]="text().cancel"
            [submitDisabled]="!validEvent() || saving()"
            [cancelDisabled]="saving()"
            (save)="createEvent()"
            (cancel)="cancelCreating()"
            (nameChange)="updatePendingName($event)"
          >
            <label class="field-label" for="event-players">{{ text().players }}</label>
            <input
              id="event-players"
              name="playerCount"
              type="number"
              required
              min="1"
              step="1"
              [disabled]="saving()"
              [value]="pendingPlayerCount()"
              (input)="updatePlayerCount($event)"
              aria-describedby="players-hint"
            />
            <p class="field-hint" id="players-hint">{{ text().playersHint }}</p>
          </gaia-event-creation>
        }
      </gaia-events-page>
    </main>
  `,
})
export class EventsComponent {
  protected readonly preferences = inject(PreferencesService);
  protected readonly eventStore = inject(AxtEventStore);
  protected readonly mode = inject(DisplayModeService);
  protected readonly nameMaxLength = EVENT_NAME_MAX_LENGTH;
  protected readonly text = computed(() => TEXT[this.preferences.language()]);
  protected readonly creating = signal(false);
  protected readonly pendingName = signal('');
  protected readonly pendingPlayerCount = signal<number | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly saving = signal(false);
  protected readonly validEvent = computed(() => {
    const playerCount = this.pendingPlayerCount();
    return (
      !!this.pendingName().trim() &&
      playerCount !== null &&
      Number.isSafeInteger(playerCount) &&
      playerCount > 0
    );
  });
  protected readonly events = computed<readonly EventListItem[]>(() =>
    this.eventStore.events().map((event) => ({
      id: event.id,
      name: event.name,
      description: `${event.playerCount} ${event.playerCount === 1 ? this.text().player : this.text().playersPlural}`,
      link: `/axt/events/${encodeURIComponent(event.id)}`,
      openLabel: this.text().open.replace('{name}', event.name),
    })),
  );

  constructor() {
    effect(() => {
      if (!this.mode.admin()) this.creating.set(false);
    });
  }

  protected startCreating(): void {
    this.pendingName.set('');
    this.pendingPlayerCount.set(null);
    this.creating.set(true);
  }

  protected cancelCreating(): void {
    if (!this.saving()) this.creating.set(false);
  }

  protected updatePendingName(name: string): void {
    this.pendingName.set(name.slice(0, EVENT_NAME_MAX_LENGTH));
  }

  protected updatePlayerCount(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pendingPlayerCount.set(input.value === '' ? null : input.valueAsNumber);
  }

  protected async createEvent(): Promise<void> {
    const playerCount = this.pendingPlayerCount();
    if (!this.mode.admin() || !this.validEvent() || playerCount === null || this.saving()) return;
    this.saving.set(true);
    try {
      const created = await this.eventStore.create(this.pendingName(), playerCount);
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

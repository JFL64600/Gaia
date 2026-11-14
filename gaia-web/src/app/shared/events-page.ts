import { Component, computed, inject, input, model, output } from '@angular/core';
import { PreferencesService } from '../preferences/preferences.service';
import { EventCard } from './event-card';

export interface EventListItem {
  readonly id: string;
  readonly name: string;
  readonly link?: string;
  readonly openLabel?: string;
  readonly deleteLabel?: string;
}

const LABELS = {
  fr: {
    title: 'Évènements', create: 'Créer un évènement', search: 'Rechercher un évènement',
    single: 'évènement', plural: 'évènements', loading: 'Chargement des évènements…',
    error: 'La connexion à Firebase a échoué.', empty: 'Aucun évènement pour le moment',
    emptyHint: 'Créez votre premier évènement pour commencer.',
    readonlyEmptyHint: 'Les évènements disponibles apparaîtront ici.',
    noResults: 'Aucun évènement trouvé', noResultsHint: 'Essayez avec un autre nom.',
  },
  eu: {
    title: 'Ekitaldiak', create: 'Sortu ekitaldia', search: 'Bilatu ekitaldiak',
    single: 'ekitaldi', plural: 'ekitaldi', loading: 'Ekitaldiak kargatzen…',
    error: 'Ezin izan da Firebase-ra konektatu.', empty: 'Oraindik ez dago ekitaldirik',
    emptyHint: 'Sortu zure lehen ekitaldia hasteko.',
    readonlyEmptyHint: 'Eskuragarri dauden ekitaldiak hemen agertuko dira.',
    noResults: 'Ez da ekitaldirik aurkitu', noResultsHint: 'Saiatu beste izen batekin.',
  },
} as const;

@Component({
  selector: 'gaia-events-page',
  imports: [EventCard],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css',
})
export class EventsPage {
  readonly events = input.required<readonly EventListItem[]>();
  readonly canCreate = input(true);
  readonly creating = input(false);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly query = model('');
  readonly create = output<void>();
  readonly remove = output<EventListItem>();
  private readonly preferences = inject(PreferencesService);
  protected readonly labels = computed(() => LABELS[this.preferences.language()]);
  protected readonly filteredEvents = computed(() => {
    const language = this.preferences.language();
    const query = this.query().trim().toLocaleLowerCase(language);
    return this.events().filter((event) => event.name.toLocaleLowerCase(language).includes(query));
  });
  protected readonly count = computed(() => {
    const count = this.filteredEvents().length;
    return `${count} ${count === 1 ? this.labels().single : this.labels().plural}`;
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}

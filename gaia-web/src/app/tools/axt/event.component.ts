import { Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PreferencesService } from '../../preferences/preferences.service';
import { AxtEventStore } from './core/event.store';

const TEXT = {
  fr: {
    title: 'Évènement',
    players: 'Nombre de joueurs',
    loading: 'Chargement de l’évènement…',
    missing: 'Évènement introuvable.',
    back: 'Retour aux évènements',
  },
  eu: {
    title: 'Ekitaldia',
    players: 'Jokalari kopurua',
    loading: 'Ekitaldia kargatzen…',
    missing: 'Ez da ekitaldia aurkitu.',
    back: 'Itzuli ekitaldietara',
  },
} as const;

@Component({
  imports: [RouterLink],
  template: `
    <main class="content">
      <a class="secondary-button" routerLink="/axt/events">{{ text().back }}</a>
      @if (event(); as current) {
        <section class="event-detail" aria-labelledby="event-title">
          <h1 id="event-title">{{ current.name }}</h1>
          <p>
            <strong>{{ text().players }}:</strong> {{ current.playerCount }}
          </p>
          <a class="share-link" [href]="shareUrl()">{{ shareUrl() }}</a>
        </section>
      } @else if (eventStore.loading()) {
        <p role="status">{{ text().loading }}</p>
      } @else {
        <p role="alert">{{ text().missing }}</p>
      }
    </main>
  `,
  styles: `
    .event-detail {
      margin-top: 2rem;
      padding: 1.5rem;
      border: 1px solid var(--border);
      border-radius: 0.9rem;
      background: var(--surface);
    }
    .share-link {
      overflow-wrap: anywhere;
      color: var(--accent);
    }
  `,
})
export class EventComponent {
  protected readonly eventStore = inject(AxtEventStore);
  private readonly route = inject(ActivatedRoute);
  private readonly preferences = inject(PreferencesService);
  private readonly location = inject(Location);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly text = computed(() => TEXT[this.preferences.language()]);
  protected readonly event = computed(() => {
    const id = this.params().get('id');
    return this.eventStore.events().find((event) => event.id === id) ?? null;
  });
  protected readonly shareUrl = computed(() => {
    const id = this.params().get('id');
    if (!id) return '';
    const path = this.location.prepareExternalUrl(`/axt/events/${encodeURIComponent(id)}`);
    return new URL(path, globalThis.location.origin).toString();
  });
}

import { computed, DestroyRef, Injectable, inject, signal } from '@angular/core';
import { EVENTS_REMOTE } from './events.remote';
import { Game } from './games';

export interface Team {
  readonly name: string;
  readonly gameIds: readonly string[];
}

export interface ScoreEvent {
  readonly id: string;
  readonly name: string;
  readonly teamCount?: number;
  readonly gameIds?: readonly string[];
}

export interface NewScoreEvent {
  readonly name: string;
  readonly teamCount: number;
  readonly gameIds: readonly string[];
  readonly teams: readonly Team[];
}

export const EVENT_NAME_MAX_LENGTH = 80;
export const MAX_TEAM_COUNT = 100;

@Injectable({ providedIn: 'root' })
export class EventStore {
  private readonly remote = inject(EVENTS_REMOTE);
  readonly events = signal<readonly ScoreEvent[]>([]);
  readonly games = signal<readonly Game[]>([]);
  readonly loading = signal(true);
  private readonly watchError = signal<string | null>(null);
  private readonly writeError = signal<string | null>(null);
  readonly error = computed(() => this.writeError() ?? this.watchError());

  constructor() {
    const reportError = (error: unknown) => {
      this.loading.set(false);
      this.watchError.set(error instanceof Error ? error.message : String(error));
    };
    const stopGames = this.remote.watchGames((games) => this.games.set(games), reportError);
    const stopEvents = this.remote.watchEvents(
      (events) => {
        this.events.set(events);
        this.loading.set(false);
        this.watchError.set(null);
      },
      reportError,
    );
    inject(DestroyRef).onDestroy(() => {
      stopGames();
      stopEvents();
    });
  }

  async create(
    name: string,
    teamCount: number,
    gameIds: readonly string[],
  ): Promise<ScoreEvent | null> {
    const normalizedName = name.trim();
    const knownGames = new Set(this.games().map(({ code }) => code));
    if (!normalizedName || normalizedName.length > EVENT_NAME_MAX_LENGTH ||
        !Number.isSafeInteger(teamCount) || teamCount <= 0 || teamCount > MAX_TEAM_COUNT ||
        gameIds.length === 0 || !gameIds.every((gameId) => knownGames.has(gameId)) ||
        new Set(gameIds).size !== gameIds.length) {
      this.writeError.set('Invalid event: name, team count between 1 and 100 and at least one valid game are required.');
      return null;
    }

    this.writeError.set(null);
    try {
      const event: NewScoreEvent = {
        name: normalizedName,
        teamCount,
        gameIds: [...gameIds],
        teams: Array.from({ length: teamCount }, (_, index) => ({
          name: String(index + 1),
          gameIds: [...gameIds],
        })),
      };
      const id = await this.remote.create(event);
      return { id, name: event.name, teamCount, gameIds: event.gameIds };
    } catch (error) {
      this.writeError.set(error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  async remove(id: string): Promise<void> {
    this.writeError.set(null);
    try {
      await this.remote.remove(id);
      this.events.update((events) => events.filter((event) => event.id !== id));
    } catch (error) {
      this.writeError.set(error instanceof Error ? error.message : String(error));
    }
  }
}

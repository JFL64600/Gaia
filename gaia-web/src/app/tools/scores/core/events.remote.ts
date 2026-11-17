import { InjectionToken } from '@angular/core';
import type { NewScoreEvent, ScoreEvent } from './event.store';
import type { Game } from './games';

export interface EventsRemote {
  watchGames(
    onGames: (games: readonly Game[]) => void,
    onError: (error: unknown) => void,
  ): () => void;
  watchEvents(
    onEvents: (events: readonly ScoreEvent[]) => void,
    onError: (error: unknown) => void,
  ): () => void;
  create(event: NewScoreEvent): Promise<string>;
  remove(id: string): Promise<void>;
}

export const EVENTS_REMOTE = new InjectionToken<EventsRemote>('EVENTS_REMOTE');

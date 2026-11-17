import { InjectionToken } from '@angular/core';

export interface AxtEvent {
  readonly id: string;
  readonly name: string;
  readonly playerCount: number;
}

export interface NewAxtEvent {
  readonly name: string;
  readonly playerCount: number;
}

export interface AxtEventsRemote {
  watchEvents(
    onEvents: (events: readonly AxtEvent[]) => void,
    onError: (error: unknown) => void,
  ): () => void;
  create(event: NewAxtEvent): Promise<string>;
}

export const AXT_EVENTS_REMOTE = new InjectionToken<AxtEventsRemote>('AXT_EVENTS_REMOTE');

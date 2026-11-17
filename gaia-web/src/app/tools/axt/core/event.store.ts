import { computed, DestroyRef, Injectable, inject, signal } from '@angular/core';
import { AxtEvent, NewAxtEvent } from './events.remote';
import { AXT_EVENTS_REMOTE } from './events.remote';

export const EVENT_NAME_MAX_LENGTH = 80;

@Injectable({ providedIn: 'root' })
export class AxtEventStore {
  private readonly remote = inject(AXT_EVENTS_REMOTE);
  readonly events = signal<readonly AxtEvent[]>([]);
  readonly loading = signal(true);
  private readonly watchError = signal<string | null>(null);
  private readonly writeError = signal<string | null>(null);
  readonly error = computed(() => this.writeError() ?? this.watchError());

  constructor() {
    const stopEvents = this.remote.watchEvents(
      (events) => {
        this.events.set(events);
        this.loading.set(false);
        this.watchError.set(null);
      },
      (error: unknown) => {
        this.loading.set(false);
        this.watchError.set(error instanceof Error ? error.message : String(error));
      },
    );
    inject(DestroyRef).onDestroy(stopEvents);
  }

  async create(name: string, playerCount: number): Promise<AxtEvent | null> {
    const normalizedName = name.trim();
    if (
      !normalizedName ||
      normalizedName.length > EVENT_NAME_MAX_LENGTH ||
      !Number.isSafeInteger(playerCount) ||
      playerCount <= 0
    ) {
      this.writeError.set(
        'Invalid event: a name and a positive whole number of players are required.',
      );
      return null;
    }

    this.writeError.set(null);
    try {
      const event: NewAxtEvent = { name: normalizedName, playerCount };
      const id = await this.remote.create(event);
      return { id, ...event };
    } catch (error) {
      this.writeError.set(error instanceof Error ? error.message : String(error));
      return null;
    }
  }
}

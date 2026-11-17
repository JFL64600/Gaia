import { TestBed } from '@angular/core/testing';
import { AXT_EVENTS_REMOTE, AxtEvent, AxtEventsRemote, NewAxtEvent } from './events.remote';
import { AxtEventStore } from './event.store';

class MemoryAxtEventsRemote implements AxtEventsRemote {
  readonly created: NewAxtEvent[] = [];
  failure?: Error;

  watchEvents(onEvents: (events: readonly AxtEvent[]) => void): () => void {
    onEvents([]);
    return () => undefined;
  }

  async create(event: NewAxtEvent): Promise<string> {
    if (this.failure) throw this.failure;
    this.created.push(event);
    return `event-${this.created.length}`;
  }
}

describe('AxtEventStore', () => {
  let remote: MemoryAxtEventsRemote;

  beforeEach(() => {
    remote = new MemoryAxtEventsRemote();
    TestBed.configureTestingModule({
      providers: [{ provide: AXT_EVENTS_REMOTE, useValue: remote }],
    });
  });

  it('trims names and requires a positive safe integer player count', async () => {
    const store = TestBed.inject(AxtEventStore);

    expect(await store.create('  Finala  ', 18)).toEqual({
      id: 'event-1',
      name: 'Finala',
      playerCount: 18,
    });
    expect(await store.create('   ', 18)).toBeNull();
    expect(await store.create('Finala', 0)).toBeNull();
    expect(await store.create('Finala', 1.5)).toBeNull();
    expect(await store.create('Finala', Number.MAX_SAFE_INTEGER + 1)).toBeNull();
    expect(remote.created).toEqual([{ name: 'Finala', playerCount: 18 }]);
  });

  it('surfaces Firebase write failures', async () => {
    const store = TestBed.inject(AxtEventStore);
    remote.failure = new Error('permission-denied');

    expect(await store.create('Finala', 18)).toBeNull();
    expect(store.error()).toBe('permission-denied');
  });
});

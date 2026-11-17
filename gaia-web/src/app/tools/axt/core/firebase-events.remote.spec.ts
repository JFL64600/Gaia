import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FirebaseAxtEventsRemote } from './firebase-events.remote';

const listener = vi.hoisted(() => ({
  onValue: undefined as ((snapshot: { val: () => unknown }) => void) | undefined,
}));

const database = vi.hoisted(() => ({
  set: vi.fn().mockResolvedValue(undefined),
  onValue: vi.fn((_ref: string, callback: (snapshot: { val: () => unknown }) => void) => {
    listener.onValue = callback;
    return vi.fn();
  }),
}));

vi.mock('firebase/app', () => ({
  getApps: () => [{ name: 'gaia-axt' }],
  initializeApp: vi.fn(),
}));

vi.mock('firebase/database', () => ({
  getDatabase: () => 'axt-database',
  ref: vi.fn((_database: string, path: string) => path),
  push: vi.fn(() => ({ key: 'event-123' })),
  set: database.set,
  serverTimestamp: () => ({ '.sv': 'timestamp' }),
  onValue: database.onValue,
}));

describe('FirebaseAxtEventsRemote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes events to the AXT Realtime Database with a server timestamp', async () => {
    const remote = TestBed.inject(FirebaseAxtEventsRemote);

    await expect(remote.create({ name: 'Finala', playerCount: 18 })).resolves.toBe('event-123');
    expect(database.set).toHaveBeenCalledWith(
      { key: 'event-123' },
      {
        name: 'Finala',
        playerCount: 18,
        createdAt: { '.sv': 'timestamp' },
      },
    );
  });

  it('maps valid records from the events collection and ignores malformed data', async () => {
    const remote = TestBed.inject(FirebaseAxtEventsRemote);
    const onEvents = vi.fn();
    remote.watchEvents(onEvents, vi.fn());
    await vi.waitFor(() => expect(database.onValue).toHaveBeenCalledOnce());

    listener.onValue!({
      val: () => ({
        good: { name: 'Finala', playerCount: 18 },
        bad: { name: 'Broken', playerCount: 0 },
        missing: null,
      }),
    });
    expect(onEvents).toHaveBeenCalledWith([{ id: 'good', name: 'Finala', playerCount: 18 }]);
  });
});

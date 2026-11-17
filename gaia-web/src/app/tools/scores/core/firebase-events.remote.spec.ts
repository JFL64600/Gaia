import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { FirebaseEventsRemote } from './firebase-events.remote';

type Snapshot = {
  metadata: { hasPendingWrites: boolean };
  docs: { id: string; data: () => Record<string, unknown> }[];
};

const listener = vi.hoisted(() => ({
  onNext: undefined as ((snapshot: Snapshot) => void) | undefined,
}));

const batch = vi.hoisted(() => ({
  set: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('firebase/app', () => ({
  getApps: () => [{ name: 'gaia-scores' }],
  initializeApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: () => 'firestore',
  doc: vi.fn((_firestore: string, ...path: string[]) => path.join('/')),
  collection: vi.fn((_firestore: string, ...path: string[]) => path.join('/')),
  orderBy: vi.fn((field: string, direction: string) => ({ field, direction })),
  query: vi.fn((collectionPath: string, order: object) => ({ collectionPath, order })),
  onSnapshot: vi.fn((_query: object, _options: object, onNext: (snapshot: Snapshot) => void) => {
    listener.onNext = onNext;
    return () => undefined;
  }),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  writeBatch: () => batch,
  serverTimestamp: () => 'server-timestamp',
}));

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('FirebaseEventsRemote', () => {
  it('creates the event (UUID) and its teams sub-collection (team number ids) in one batch', async () => {
    const remote = TestBed.inject(FirebaseEventsRemote);

    const id = await remote.create({
      name: 'Tournoi Gaia', teamCount: 2, gameIds: ['Arpana', 'Toka'],
      teams: [
        { name: '1', gameIds: ['Arpana', 'Toka'] },
        { name: '2', gameIds: ['Arpana', 'Toka'] },
      ],
    });

    expect(id).toMatch(UUID);
    expect(batch.set).toHaveBeenCalledTimes(3);
    expect(batch.set).toHaveBeenNthCalledWith(1, `events/${id}`, {
      name: 'Tournoi Gaia',
      teamCount: 2,
      gameIds: ['Arpana', 'Toka'],
      createdAt: 'server-timestamp',
    });
    const [teamPath, team] = batch.set.mock.calls[2];
    expect(teamPath).toBe(`events/${id}/teams/2`);
    expect(team).toEqual({ name: '2', gameIds: ['Arpana', 'Toka'] });
    expect(doc).toHaveBeenCalledWith('firestore', 'events', id);
    expect(batch.commit).toHaveBeenCalledOnce();
  });

  it('deletes the event document directly', async () => {
    const remote = TestBed.inject(FirebaseEventsRemote);

    await remote.remove('tournament');

    expect(doc).toHaveBeenCalledWith('firestore', 'events', 'tournament');
    expect(deleteDoc).toHaveBeenCalledWith('events/tournament');
  });

  it('ignores snapshots with pending local writes', async () => {
    listener.onNext = undefined;
    const remote = TestBed.inject(FirebaseEventsRemote);
    const onEvents = vi.fn();
    remote.watchEvents(onEvents, vi.fn());
    await vi.waitFor(() => expect(onSnapshot).toHaveBeenCalledOnce());
    expect(onSnapshot).toHaveBeenCalledWith(
      expect.anything(),
      { includeMetadataChanges: true },
      expect.any(Function),
      expect.any(Function),
    );

    listener.onNext!({
      metadata: { hasPendingWrites: true },
      docs: [{ id: 'temporary', data: () => ({ name: 'Temporary' }) }],
    });
    expect(onEvents).not.toHaveBeenCalled();

    listener.onNext!({
      metadata: { hasPendingWrites: false },
      docs: [{ id: 'saved', data: () => ({ name: 'Saved' }) }],
    });
    expect(onEvents).toHaveBeenCalledWith([
      { id: 'saved', name: 'Saved', teamCount: undefined, gameIds: undefined },
    ]);
  });
});

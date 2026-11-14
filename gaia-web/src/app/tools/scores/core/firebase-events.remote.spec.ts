import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { doc } from 'firebase/firestore';
import { FirebaseEventsRemote } from './firebase-events.remote';

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
});

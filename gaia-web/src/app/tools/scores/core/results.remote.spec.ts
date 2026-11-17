import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ResultsRemote } from './results.remote';

const mocks = vi.hoisted(() => ({
  updateDoc: vi.fn().mockResolvedValue(undefined),
  listener: undefined as ((snapshot: unknown) => void) | undefined,
}));

vi.mock('firebase/app', () => ({
  getApps: () => [{ name: 'gaia-scores' }],
  initializeApp: vi.fn(),
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => 'firestore',
  doc: (_firestore: string, ...path: string[]) => path.join('/'),
  collection: (_firestore: string, ...path: string[]) => path.join('/'),
  FieldPath: class {
    readonly segments: string[];
    constructor(...segments: string[]) { this.segments = segments; }
  },
  deleteField: () => 'deleted',
  updateDoc: mocks.updateDoc,
  onSnapshot: (_ref: unknown, _options: unknown, next: (snapshot: unknown) => void) => {
    mocks.listener = next;
    return () => undefined;
  },
}));

describe('ResultsRemote', () => {
  it('writes and clears only the selected game field', async () => {
    const remote = TestBed.inject(ResultsRemote);
    await remote.save('event', '2', 'game.with.dot', 14);
    await remote.save('event', '2', 'game.with.dot', null);
    expect(mocks.updateDoc).toHaveBeenNthCalledWith(1, 'events/event/teams/2', expect.objectContaining({ segments: ['scores', 'game.with.dot'] }), 14);
    expect(mocks.updateDoc).toHaveBeenNthCalledWith(2, 'events/event/teams/2', expect.objectContaining({ segments: ['scores', 'game.with.dot'] }), 'deleted');
  });

  it('reads and numerically orders teams and ignores pending writes', async () => {
    const remote = TestBed.inject(ResultsRemote);
    const next = vi.fn();
    remote.watchTeams('event', next, vi.fn());
    await vi.waitFor(() => expect(mocks.listener).toBeDefined());
    const snapshot = {
      metadata: { hasPendingWrites: true },
      docs: [
        { id: '10', data: () => ({ name: '10', gameIds: ['game'], scores: { game: 0 } }) },
        { id: '2', data: () => ({ name: '2', gameIds: ['game'] }) },
      ],
    };
    mocks.listener!(snapshot);
    expect(next).not.toHaveBeenCalled();
    snapshot.metadata.hasPendingWrites = false;
    mocks.listener!(snapshot);
    expect(next.mock.calls[0][0]).toEqual([
      { id: '2', name: '2', gameIds: ['game'], scores: {} },
      { id: '10', name: '10', gameIds: ['game'], scores: { game: 0 } },
    ]);
  });
});

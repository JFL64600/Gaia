import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FIREBASE_OPTIONS } from './firebase.token';
import { FirestoreChronometerRemote } from './firestore-chronometer.remote';

const firestore = vi.hoisted(() => ({
  setDoc: vi.fn().mockResolvedValue(undefined),
  onSnapshot: vi.fn(),
}));

vi.mock('firebase/app', () => ({
  getApps: () => [{ name: 'gaia-rox' }],
  initializeApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: () => 'firestore',
  doc: (_firestore: string, ...path: string[]) => path.join('/'),
  collection: (_firestore: string, path: string) => path,
  setDoc: firestore.setDoc,
  onSnapshot: firestore.onSnapshot,
}));

describe('FirestoreChronometerRemote', () => {
  beforeEach(() => {
    firestore.setDoc.mockClear();
    firestore.onSnapshot.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: FIREBASE_OPTIONS, useValue: { projectId: 'test' } }],
    });
  });

  it.each([true, false])('writes the event and resume option together (%s)', async (enabled) => {
    const remote = TestBed.inject(FirestoreChronometerRemote);
    remote.push('event-123', { name: 'Race', chronometers: [], resumeEnabled: enabled });

    await vi.waitFor(() => expect(firestore.setDoc).toHaveBeenCalledOnce());
    expect(firestore.setDoc).toHaveBeenCalledWith(
      'events/event-123',
      { name: 'Race', chronometers: [], resumeEnabled: enabled },
      { merge: true },
    );
  });

  it('does not overwrite the option on subsequent chronometer updates', async () => {
    const remote = TestBed.inject(FirestoreChronometerRemote);
    remote.push('event-123', { name: 'Race', chronometers: [] });

    await vi.waitFor(() => expect(firestore.setDoc).toHaveBeenCalledOnce());
    expect(firestore.setDoc).toHaveBeenCalledWith(
      'events/event-123',
      { name: 'Race', chronometers: [] },
      { merge: true },
    );
  });

  it('reports a failed event write', async () => {
    const error = new Error('Permission denied');
    firestore.setDoc.mockRejectedValueOnce(error);
    const onError = vi.fn();
    TestBed.inject(FirestoreChronometerRemote).push(
      'event-123',
      { name: 'Race', chronometers: [], resumeEnabled: true },
      onError,
    );

    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(error));
  });

  it('loads the saved option and defaults older events to disabled', async () => {
    const remote = TestBed.inject(FirestoreChronometerRemote);
    const onChange = vi.fn();
    remote.watchEvents(onChange);
    await vi.waitFor(() => expect(firestore.onSnapshot).toHaveBeenCalledOnce());

    const listener = firestore.onSnapshot.mock.calls[0][1];
    listener({
      docs: [
        { id: 'event-123', data: () => ({ name: 'Race', resumeEnabled: true }) },
        { id: 'event-456', data: () => ({ name: 'Old race' }) },
      ],
    });
    expect(onChange).toHaveBeenCalledWith([
      { id: 'event-123', name: 'Race', resumeEnabled: true },
      { id: 'event-456', name: 'Old race', resumeEnabled: false },
    ]);
  });
});

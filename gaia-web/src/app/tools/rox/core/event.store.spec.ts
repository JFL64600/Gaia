import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CHRONOMETER_REMOTE, ChronometerRemote, RemoteEvent } from './chronometer.tokens';
import { EventStore } from './event.store';

describe('EventStore synchronization', () => {
  it('saves the option with the event and uses the synchronized value', () => {
    let updateEvents: (events: readonly RemoteEvent[]) => void = () => undefined;
    const push = vi.fn();
    const remote: ChronometerRemote = {
      connect: () => () => undefined,
      push,
      watchEvents: (onChange) => {
        updateEvents = onChange;
        return () => undefined;
      },
    };
    TestBed.configureTestingModule({ providers: [{ provide: CHRONOMETER_REMOTE, useValue: remote }] });
    const store = TestBed.inject(EventStore);
    const event = store.create('Race', true)!;

    expect(push).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith(
      event.id,
      { name: 'Race', chronometers: [], resumeEnabled: true },
      expect.any(Function),
    );
    updateEvents([{ id: event.id, name: event.name, resumeEnabled: true }]);
    expect(store.find(event.id)?.resumeEnabled).toBe(true);
  });

  it('reports a failed creation write', () => {
    const remote: ChronometerRemote = {
      connect: () => () => undefined,
      push: (_id, _snapshot, onError) => onError?.(new Error('Write failed')),
    };
    TestBed.configureTestingModule({ providers: [{ provide: CHRONOMETER_REMOTE, useValue: remote }] });
    const store = TestBed.inject(EventStore);
    store.create('Race', true);
    expect(store.syncError()).toBe(true);
  });
});

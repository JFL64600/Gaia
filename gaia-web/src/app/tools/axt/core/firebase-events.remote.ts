import { Injectable } from '@angular/core';
import { FIREBASE_CONFIG } from './firebase.config';
import { AxtEvent, AxtEventsRemote, NewAxtEvent } from './events.remote';
import { getNamedFirebaseApp } from '../../../firebase-app';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

@Injectable({ providedIn: 'root' })
export class FirebaseAxtEventsRemote implements AxtEventsRemote {
  watchEvents(
    onEvents: (events: readonly AxtEvent[]) => void,
    onError: (error: unknown) => void,
  ): () => void {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    void this.openFirebase()
      .then(({ database, databaseSdk }) => {
        if (disposed) return;
        unsubscribe = databaseSdk.onValue(
          databaseSdk.ref(database, 'events'),
          (snapshot) => {
            const value: unknown = snapshot.val();
            const events = isRecord(value)
              ? Object.entries(value).flatMap(([id, entry]) => {
                  if (!isRecord(entry)) return [];
                  const name = entry['name'];
                  const playerCount = entry['playerCount'];
                  if (
                    typeof name !== 'string' ||
                    typeof playerCount !== 'number' ||
                    !Number.isSafeInteger(playerCount) ||
                    playerCount <= 0
                  ) {
                    return [];
                  }
                  return [{ id, name, playerCount }];
                })
              : [];
            onEvents(events);
          },
          onError,
        );
      })
      .catch(onError);

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }

  async create(event: NewAxtEvent): Promise<string> {
    const { database, databaseSdk } = await this.openFirebase();
    const eventRef = databaseSdk.push(databaseSdk.ref(database, 'events'));
    if (!eventRef.key) {
      throw new Error('Firebase did not generate an event key.');
    }
    await databaseSdk.set(eventRef, {
      ...event,
      createdAt: databaseSdk.serverTimestamp(),
    });
    return eventRef.key;
  }

  private async openFirebase() {
    const [app, databaseSdk] = await Promise.all([
      getNamedFirebaseApp(FIREBASE_CONFIG, 'gaia-axt'),
      import('firebase/database'),
    ]);
    return { database: databaseSdk.getDatabase(app), databaseSdk };
  }
}

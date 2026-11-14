import { Injectable } from '@angular/core';
import type { DocumentData, QueryConstraint } from 'firebase/firestore';
import { FIREBASE_CONFIG } from './firebase.config';
import { EventsRemote } from './events.remote';
import { NewScoreEvent, ScoreEvent } from './event.store';
import { Game, toGame } from './games';
import { getNamedFirebaseApp } from '../../../firebase-app';

const isString = (value: unknown): value is string => typeof value === 'string';

@Injectable({ providedIn: 'root' })
export class FirebaseEventsRemote implements EventsRemote {
  watchGames(
    onGames: (games: readonly Game[]) => void,
    onError: (error: unknown) => void,
  ): () => void {
    return this.watch('games', 'label', 'asc', (docs) =>
      onGames(docs.map(({ id, data }) => toGame(id, data)).filter((game) => game !== null)), onError);
  }

  watchEvents(
    onEvents: (events: readonly ScoreEvent[]) => void,
    onError: (error: unknown) => void,
  ): () => void {
    return this.watch('events', 'createdAt', 'desc', (docs) =>
      onEvents(
        docs.map(({ id, data }) => {
          const name = data['name'];
          const teamCount = data['teamCount'];
          const gameIds: unknown = data['gameIds'];
          return {
            id,
            name: typeof name === 'string' ? name : '',
            teamCount: Number.isSafeInteger(teamCount) && teamCount > 0 ? teamCount : undefined,
            gameIds: Array.isArray(gameIds) ? gameIds.filter(isString) : undefined,
          };
        }),
      ), onError);
  }

  private watch(
    collection: string,
    orderField: string,
    direction: 'asc' | 'desc',
    onDocs: (docs: { id: string; data: DocumentData }[]) => void,
    onError: (error: unknown) => void,
  ): () => void {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    void this.openFirebase()
      .then(({ firestore, firestoreSdk }) => {
        if (disposed) {
          return;
        }
        const order: QueryConstraint = firestoreSdk.orderBy(orderField, direction);
        unsubscribe = firestoreSdk.onSnapshot(
          firestoreSdk.query(firestoreSdk.collection(firestore, collection), order),
          (snapshot) => onDocs(snapshot.docs.map((document) => ({
            id: document.id, data: document.data(),
          }))),
          onError,
        );
      })
      .catch(onError);

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }

  // The event and its `teams` sub-collection are written atomically in one batch.
  async create({ teams, ...event }: NewScoreEvent): Promise<string> {
    const { firestore, firestoreSdk } = await this.openFirebase();
    const id = crypto.randomUUID();
    const batch = firestoreSdk.writeBatch(firestore);
    batch.set(firestoreSdk.doc(firestore, 'events', id), {
      ...event,
      createdAt: firestoreSdk.serverTimestamp(),
    });
    for (const team of teams) {
      batch.set(firestoreSdk.doc(firestore, 'events', id, 'teams', team.name), {
        name: team.name,
        gameIds: [...team.gameIds],
      });
    }
    await batch.commit();
    return id;
  }

  private async openFirebase() {
    const [app, firestoreSdk] = await Promise.all([
      getNamedFirebaseApp(FIREBASE_CONFIG, 'gaia-scores'),
      import('firebase/firestore'),
    ]);
    return { firestore: firestoreSdk.getFirestore(app), firestoreSdk };
  }
}

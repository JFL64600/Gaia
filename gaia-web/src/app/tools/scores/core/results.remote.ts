import { Injectable } from '@angular/core';
import { getNamedFirebaseApp } from '../../../firebase-app';
import { FIREBASE_CONFIG } from './firebase.config';

export type ResultValue = string | number;

export interface ResultTeam {
  readonly id: string;
  readonly name: string;
  readonly gameIds: readonly string[];
  readonly scores: Readonly<Record<string, ResultValue>>;
}

@Injectable({ providedIn: 'root' })
export class ResultsRemote {
  watchEvent(
    eventId: string,
    onEvent: (event: { name: string; gameIds: readonly string[] } | null) => void,
    onError: (error: unknown) => void,
  ): () => void {
    return this.subscribe(async (firestore, sdk) =>
      sdk.onSnapshot(sdk.doc(firestore, 'events', eventId), (snapshot) => {
        if (!snapshot.exists()) {
          onEvent(null);
          return;
        }
        const data = snapshot.data();
        if (typeof data['name'] !== 'string' || !Array.isArray(data['gameIds']) ||
            !data['gameIds'].every((id: unknown) => typeof id === 'string')) {
          onError(new Error('Invalid event data'));
          return;
        }
        onEvent({ name: data['name'], gameIds: data['gameIds'] });
      }, onError), onError);
  }

  watchTeams(
    eventId: string,
    onTeams: (teams: readonly ResultTeam[]) => void,
    onError: (error: unknown) => void,
  ): () => void {
    return this.subscribe(async (firestore, sdk) =>
      sdk.onSnapshot(sdk.collection(firestore, 'events', eventId, 'teams'),
        { includeMetadataChanges: true }, (snapshot) => {
          if (snapshot.metadata.hasPendingWrites) return;
          const teams: ResultTeam[] = [];
          for (const document of snapshot.docs) {
            const data = document.data();
            const scores = data['scores'] ?? {};
            if (typeof data['name'] !== 'string' || !Array.isArray(data['gameIds']) ||
                !data['gameIds'].every((id: unknown) => typeof id === 'string') ||
                typeof scores !== 'object' || scores === null || Array.isArray(scores) ||
                !Object.values(scores).every((value) =>
                  typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)))) {
              onError(new Error(`Invalid team data: ${document.id}`));
              return;
            }
            teams.push({ id: document.id, name: data['name'], gameIds: data['gameIds'], scores });
          }
          onTeams(teams.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })));
        }, onError), onError);
  }

  async save(eventId: string, teamId: string, gameId: string, value: ResultValue | null): Promise<void> {
    const [app, sdk] = await Promise.all([
      getNamedFirebaseApp(FIREBASE_CONFIG, 'gaia-scores'),
      import('firebase/firestore'),
    ]);
    await sdk.updateDoc(
      sdk.doc(sdk.getFirestore(app), 'events', eventId, 'teams', teamId),
      new sdk.FieldPath('scores', gameId),
      value === null ? sdk.deleteField() : value,
    );
  }

  private subscribe(
    start: (
      firestore: import('firebase/firestore').Firestore,
      sdk: typeof import('firebase/firestore'),
    ) => Promise<() => void>,
    onError: (error: unknown) => void,
  ): () => void {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    void Promise.all([
      getNamedFirebaseApp(FIREBASE_CONFIG, 'gaia-scores'),
      import('firebase/firestore'),
    ]).then(async ([app, sdk]) => {
      if (disposed) return;
      const stop = await start(sdk.getFirestore(app), sdk);
      if (disposed) stop();
      else unsubscribe = stop;
    }).catch((error: unknown) => {
      if (!disposed) onError(error);
    });
    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }
}

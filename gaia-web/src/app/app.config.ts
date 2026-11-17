import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CHRONOMETER_REMOTE } from './tools/rox/core/chronometer.tokens';
import { FIREBASE_CONFIG } from './tools/rox/core/firebase.config';
import { FirestoreChronometerRemote } from './tools/rox/core/firestore-chronometer.remote';
import { EVENTS_REMOTE } from './tools/scores/core/events.remote';
import { FirebaseEventsRemote } from './tools/scores/core/firebase-events.remote';
import { AXT_EVENTS_REMOTE } from './tools/axt/core/events.remote';
import { FirebaseAxtEventsRemote } from './tools/axt/core/firebase-events.remote';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ...(FIREBASE_CONFIG
      ? [{ provide: CHRONOMETER_REMOTE, useExisting: FirestoreChronometerRemote }]
      : []),
    { provide: EVENTS_REMOTE, useExisting: FirebaseEventsRemote },
    { provide: AXT_EVENTS_REMOTE, useExisting: FirebaseAxtEventsRemote },
  ],
};

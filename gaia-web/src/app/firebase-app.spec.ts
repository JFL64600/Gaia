import { deleteApp, initializeApp } from 'firebase/app';
import { getNamedFirebaseApp } from './firebase-app';
import { FIREBASE_CONFIG as roxConfig } from './tools/rox/core/firebase.config';
import { FIREBASE_CONFIG as scoresConfig } from './tools/scores/core/firebase.config';
import { FIREBASE_CONFIG as axtConfig } from './tools/axt/core/firebase.config';

it('keeps each tool Firebase project separate even with a default app', async () => {
  const defaultApp = initializeApp({ projectId: 'unrelated-project' });
  const rox = await getNamedFirebaseApp(roxConfig!, 'gaia-rox');
  const scores = await getNamedFirebaseApp(scoresConfig, 'gaia-scores');
  const axt = await getNamedFirebaseApp(axtConfig, 'gaia-axt');
  expect(rox.options.projectId).toBe(roxConfig!.projectId);
  expect(scores.options.projectId).toBe(scoresConfig.projectId);
  expect(axt.options.projectId).toBe(axtConfig.projectId);
  expect(new Set([rox, scores, axt]).size).toBe(3);
  expect(await getNamedFirebaseApp(roxConfig!, 'gaia-rox')).toBe(rox);
  await Promise.all([deleteApp(defaultApp), deleteApp(rox), deleteApp(scores), deleteApp(axt)]);
});

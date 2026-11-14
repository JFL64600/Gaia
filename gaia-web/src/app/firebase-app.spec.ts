import { deleteApp, initializeApp } from 'firebase/app';
import { getNamedFirebaseApp } from './firebase-app';
import { FIREBASE_CONFIG as roxConfig } from './tools/rox/core/firebase.config';
import { FIREBASE_CONFIG as scoresConfig } from './tools/scores/core/firebase.config';

it('keeps the Rox and Scores Firebase projects separate even with a default app', async () => {
  const defaultApp = initializeApp({ projectId: 'unrelated-project' });
  const rox = await getNamedFirebaseApp(roxConfig!, 'gaia-rox');
  const scores = await getNamedFirebaseApp(scoresConfig, 'gaia-scores');
  expect(rox.options.projectId).toBe(roxConfig!.projectId);
  expect(scores.options.projectId).toBe(scoresConfig.projectId);
  expect(rox).not.toBe(scores);
  expect(await getNamedFirebaseApp(roxConfig!, 'gaia-rox')).toBe(rox);
  await Promise.all([deleteApp(defaultApp), deleteApp(rox), deleteApp(scores)]);
});

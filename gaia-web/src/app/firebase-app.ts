import type { FirebaseOptions } from 'firebase/app';

export async function getNamedFirebaseApp(options: FirebaseOptions, name: string) {
  const { getApps, initializeApp } = await import('firebase/app');
  return getApps().find((app) => app.name === name) ?? initializeApp(options, name);
}

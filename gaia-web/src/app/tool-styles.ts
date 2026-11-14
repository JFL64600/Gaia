import { DestroyRef } from '@angular/core';

export function attachToolStyles(path: string, destroyRef: DestroyRef): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  document.head.appendChild(link);
  destroyRef.onDestroy(() => link.remove());
}

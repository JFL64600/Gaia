import { Injectable, signal } from '@angular/core';

export const LANGUAGES = ['fr', 'eu'] as const;
export type Language = (typeof LANGUAGES)[number];
export const THEMES = ['forest', 'basque', 'ocean', 'purple', 'sunset', 'dark'] as const;
export type ThemeId = (typeof THEMES)[number];

function storedValue<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const storage = globalThis.localStorage;
  const value = storage?.getItem(key);
  const valid = allowed.find((candidate) => candidate === value);
  if (value != null && !valid) {
    storage?.removeItem(key);
  }
  return valid ?? fallback;
}

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly languageState = signal<Language>(storedValue('gaia.language', LANGUAGES, 'fr'));
  private readonly themeState = signal<ThemeId>(
    storedValue('gaia.theme', THEMES, 'forest'),
  );
  readonly language = this.languageState.asReadonly();
  readonly theme = this.themeState.asReadonly();

  constructor() {
    document.documentElement.lang = this.language();
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  setLanguage(language: Language): void {
    localStorage.setItem('gaia.language', language);
    this.languageState.set(language);
    document.documentElement.lang = language;
  }

  setTheme(theme: ThemeId): void {
    localStorage.setItem('gaia.theme', theme);
    this.themeState.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}

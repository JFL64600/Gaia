import { Injectable, signal } from '@angular/core';

export const LANGUAGES = ['fr', 'eu'] as const;
export type Language = (typeof LANGUAGES)[number];
export const THEMES = ['forest', 'basque', 'ocean', 'purple', 'sunset', 'dark'] as const;
export type ThemeId = (typeof THEMES)[number];

function storedValue<T extends string>(
  key: string,
  legacyKeys: readonly string[],
  allowed: readonly T[],
  fallback: T,
): T {
  const storage = globalThis.localStorage;
  for (const candidateKey of [key, ...legacyKeys]) {
    const value = storage?.getItem(candidateKey);
    const valid = allowed.find((candidate) => candidate === value);
    if (valid) {
      if (candidateKey !== key) storage?.setItem(key, valid);
      return valid;
    }
  }
  return fallback;
}

function storedLanguage(): Language {
  for (const key of ['gaia.language', 'gaiascores.language', 'gaiarox.language']) {
    const value = globalThis.localStorage?.getItem(key);
    if (value && !LANGUAGES.some((language) => language === value)) {
      globalThis.localStorage?.removeItem(key);
    }
  }
  return storedValue('gaia.language', ['gaiascores.language', 'gaiarox.language'], LANGUAGES, 'fr');
}

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly languageState = signal<Language>(storedLanguage());
  private readonly themeState = signal<ThemeId>(
    storedValue('gaia.theme', ['gaiascores.theme', 'gaiarox.theme'], THEMES, 'forest'),
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

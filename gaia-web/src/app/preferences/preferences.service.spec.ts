import { TestBed } from '@angular/core/testing';
import { resetLocalStorage } from '../tools/rox/core/testing-storage';
import { PreferencesService } from './preferences.service';

describe('Gaia preferences', () => {
  beforeEach(() => resetLocalStorage());

  it('migrates valid Scores preferences before Rox preferences', () => {
    localStorage.setItem('gaiascores.language', 'fr');
    localStorage.setItem('gaiascores.theme', 'purple');
    localStorage.setItem('gaiarox.language', 'eu');
    localStorage.setItem('gaiarox.theme', 'ocean');
    const prefs = TestBed.inject(PreferencesService);
    expect(prefs.language()).toBe('fr');
    expect(prefs.theme()).toBe('purple');
    expect(localStorage.getItem('gaia.language')).toBe('fr');
    expect(localStorage.getItem('gaia.theme')).toBe('purple');
  });

  it('falls back to Rox when Scores preferences are missing or invalid', () => {
    localStorage.setItem('gaiascores.language', 'invalid');
    localStorage.setItem('gaiarox.language', 'eu');
    localStorage.setItem('gaiarox.theme', 'dark');
    const prefs = TestBed.inject(PreferencesService);
    expect(prefs.language()).toBe('eu');
    expect(prefs.theme()).toBe('dark');
  });

  it('restores Gaia preferences even when older tool preferences differ', () => {
    localStorage.setItem('gaia.language', 'fr');
    localStorage.setItem('gaia.theme', 'sunset');
    localStorage.setItem('gaiascores.language', 'eu');
    localStorage.setItem('gaiascores.theme', 'ocean');
    const prefs = TestBed.inject(PreferencesService);
    expect(prefs.language()).toBe('fr');
    expect(prefs.theme()).toBe('sunset');
  });

  it('restores choices after the service is recreated', () => {
    const prefs = TestBed.inject(PreferencesService);
    prefs.setLanguage('eu');
    prefs.setTheme('dark');
    TestBed.resetTestingModule();
    const restored = TestBed.inject(PreferencesService);
    expect(restored.language()).toBe('eu');
    expect(restored.theme()).toBe('dark');
    expect(document.documentElement.lang).toBe('eu');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('discards unsupported saved languages and uses French by default', () => {
    for (const key of ['gaia.language', 'gaiascores.language', 'gaiarox.language']) {
      localStorage.setItem(key, 'en');
    }
    expect(TestBed.inject(PreferencesService).language()).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
    for (const key of ['gaia.language', 'gaiascores.language', 'gaiarox.language']) {
      expect(localStorage.getItem(key)).toBeNull();
    }
  });
});

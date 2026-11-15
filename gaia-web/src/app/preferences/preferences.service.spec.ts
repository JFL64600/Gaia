import { TestBed } from '@angular/core/testing';
import { resetLocalStorage } from '../tools/rox/core/testing-storage';
import { PreferencesService } from './preferences.service';

describe('Gaia preferences', () => {
  beforeEach(() => resetLocalStorage());

  it('ignores old tool preferences and uses the Gaia defaults', () => {
    localStorage.setItem('gaiascores.language', 'eu');
    localStorage.setItem('gaiascores.theme', 'purple');
    localStorage.setItem('gaiarox.language', 'eu');
    localStorage.setItem('gaiarox.theme', 'ocean');
    const prefs = TestBed.inject(PreferencesService);
    expect(prefs.language()).toBe('fr');
    expect(prefs.theme()).toBe('forest');
    expect(localStorage.getItem('gaia.language')).toBeNull();
    expect(localStorage.getItem('gaia.theme')).toBeNull();
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

  it('discards invalid Gaia preferences and uses the defaults', () => {
    localStorage.setItem('gaia.language', 'en');
    localStorage.setItem('gaia.theme', 'invalid');
    const prefs = TestBed.inject(PreferencesService);
    expect(prefs.language()).toBe('fr');
    expect(prefs.theme()).toBe('forest');
    expect(document.documentElement.lang).toBe('fr');
    expect(document.documentElement.getAttribute('data-theme')).toBe('forest');
    expect(localStorage.getItem('gaia.language')).toBeNull();
    expect(localStorage.getItem('gaia.theme')).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';
import { I18n } from './i18n.service';
import { resetLocalStorage } from './testing-storage';

describe('I18n', () => {
  beforeEach(() => resetLocalStorage());

  it('uses the Gaia default language and updates the document language', () => {
    const i18n = TestBed.inject(I18n);
    expect(i18n.language()).toBe('fr');
    expect(i18n.t('chronometer.start')).toBe('Démarrer');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('switches to Basque, interpolates parameters', () => {
    const i18n = TestBed.inject(I18n);
    i18n.setLanguage('eu');
    expect(i18n.t('chronometer.startNamed', { name: 'Xabi' })).toBe('Hasi Xabi');
    expect(document.documentElement.lang).toBe('eu');
  });
});

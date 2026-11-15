import { Component, ElementRef, HostListener, inject, input, signal, viewChild } from '@angular/core';
import { LANGUAGES, Language, PreferencesService, ThemeId } from './preferences.service';
import { DisplayModeService } from './display-mode.service';

const LABELS = {
  fr: { admin: 'Mode administrateur', spectator: 'Spectateur', administrator: 'Administrateur', language: 'Langue', theme: 'Thème', forest: 'Forêt', basque: 'Basque', ocean: 'Océan', purple: 'Violet', sunset: 'Coucher de soleil', dark: 'Sombre' },
  eu: { admin: 'Administratzaile modua', spectator: 'Ikuslea', administrator: 'Administratzailea', language: 'Hizkuntza', theme: 'Gaia', forest: 'Basoa', basque: 'Euskal', ocean: 'Ozeanoa', purple: 'Morea', sunset: 'Ilunabarra', dark: 'Iluna' },
} satisfies Record<Language, Record<'admin' | 'spectator' | 'administrator' | 'language' | 'theme' | ThemeId, string>>;

@Component({
  selector: 'gaia-preferences',
  template: `
    <div class="preferences">
      @if (showModeToggle()) {
        <button class="preference-mode" type="button" role="switch"
          [attr.aria-label]="labels().admin" [attr.aria-checked]="mode.admin()"
          [attr.title]="mode.admin() ? labels().administrator : labels().spectator"
          (click)="mode.setAdmin(!mode.admin())">
          <span class="mode-track" aria-hidden="true"><span></span></span>
        </button>
      }
      <div class="preference-languages" role="group" [attr.aria-label]="labels().language">
        @for (language of languages; track language) {
          <button type="button" [attr.lang]="language"
            [attr.aria-pressed]="preferences.language() === language"
            (click)="preferences.setLanguage(language)">
            {{ language === 'eu' ? 'EUS' : language.toUpperCase() }}
          </button>
        }
      </div>
      <div class="preference-theme">
        <button #trigger class="preference-trigger" type="button"
          [style.background]="activeSwatch()" [attr.aria-label]="labels().theme"
          [attr.aria-expanded]="menuOpen()" aria-controls="gaia-theme-options"
          (click)="menuOpen.set(!menuOpen())">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 1.6-3.9 1.1 1.1 0 0 1 .8-1.9H18a3 3 0 0 0 3-3c0-5.1-4-9.2-9-9.2ZM6.8 12a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm3.1-4a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm4.3 0a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm3.1 4a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Z" />
          </svg>
        </button>
        @if (menuOpen()) {
          <div id="gaia-theme-options" class="preference-menu" role="group" [attr.aria-label]="labels().theme">
            @for (option of themes; track option.id) {
              <button class="preference-option" type="button" [style.background]="option.swatch"
                [attr.aria-label]="labels()[option.id]"
                [attr.aria-pressed]="preferences.theme() === option.id"
                (click)="selectTheme(option.id)"></button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: inline-block; }
    .preferences { display: flex; align-items: center; flex-wrap: wrap; gap: .75rem; }
    .preference-mode { display: inline-flex; align-items: center; justify-content: center; min-width: 2.75rem; min-height: 2.75rem; padding: .3rem; border: 0; background: transparent; cursor: pointer; }
    .mode-track { box-sizing: border-box; display: inline-flex; align-items: center; width: 2.25rem; height: 1.3rem; padding: .15rem; border: 1px solid var(--header-muted); border-radius: 1rem; }
    .mode-track > span { width: .85rem; height: .85rem; border-radius: 50%; background: var(--header-muted); }
    .preference-mode[aria-checked='true'] .mode-track { background: var(--header-text); }
    .preference-mode[aria-checked='true'] .mode-track > span { transform: translateX(.9rem); background: var(--header); }
    .preference-languages { display: flex; align-items: center; gap: .2rem; }
    .preference-languages button { min-width: 2.6rem; padding: .45rem .55rem; border: 1px solid var(--header-muted); border-radius: .5rem; background: transparent; color: var(--header-muted); cursor: pointer; font: inherit; font-size: .75rem; font-weight: 700; }
    .preference-languages button[aria-pressed='true'] { background: var(--header-text); color: var(--header); }
    .preference-theme { position: relative; }
    .preference-trigger { display: grid; width: 2.75rem; height: 2.75rem; place-items: center; border: 1px solid var(--header-muted); border-radius: .8rem; color: white; cursor: pointer; }
    .preference-trigger svg { width: 1.35rem; fill: currentColor; }
    .preference-menu { position: absolute; z-index: 20; top: calc(100% + .4rem); left: 50%; display: flex; flex-direction: column; gap: .4rem; padding: .4rem; border: 1px solid var(--header-muted); border-radius: 1rem; background: var(--header); box-shadow: 0 .5rem 1rem var(--shadow); transform: translateX(-50%); }
    .preference-option { box-sizing: border-box; width: 1.75rem; height: 1.75rem; padding: 0; border: 2px solid var(--header-muted); border-radius: 50%; cursor: pointer; }
    .preference-option[aria-pressed='true'] { outline: 2px solid var(--header-text); outline-offset: 2px; }
    button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  `,
})
export class PreferencesControls {
  readonly showModeToggle = input(false);
  protected readonly preferences = inject(PreferencesService);
  protected readonly mode = inject(DisplayModeService);
  protected readonly languages = LANGUAGES;
  protected readonly themes: readonly { id: ThemeId; swatch: string }[] = [
    { id: 'forest', swatch: '#10643b' }, { id: 'basque', swatch: '#c8102e' },
    { id: 'ocean', swatch: '#1769aa' }, { id: 'purple', swatch: '#6b46c1' },
    { id: 'sunset', swatch: '#c2410c' }, { id: 'dark', swatch: '#0f172a' },
  ];
  protected readonly menuOpen = signal(false);
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  protected labels() {
    return LABELS[this.preferences.language()];
  }

  protected activeSwatch(): string {
    return this.themes.find(({ id }) => id === this.preferences.theme())!.swatch;
  }

  protected selectTheme(theme: ThemeId): void {
    this.preferences.setTheme(theme);
    this.menuOpen.set(false);
    this.trigger()?.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  protected closeOnOutsideClick(event: Event): void {
    if (event.target instanceof Node && !this.element.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.trigger()?.nativeElement.focus();
    }
  }
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreferencesControls } from './preferences/preferences-controls';
import { PreferencesService } from './preferences/preferences.service';
import { GaiaBrand } from './gaia-brand';

const TEXT = {
  fr: { tools: 'Outils Gaia', timing: 'Chronomètres et classements', admin: 'administration', manage: 'Créer et gérer les événements', scores: 'Événements et équipes' },
  eu: { tools: 'Gaia tresnak', timing: 'Kronometroak eta sailkapenak', admin: 'administrazioa', manage: 'Ekitaldiak sortu eta kudeatu', scores: 'Ekitaldiak eta taldeak' },
} as const;

@Component({
  imports: [RouterLink, PreferencesControls, GaiaBrand],
  host: { '[attr.data-theme]': 'preferences.theme()' },
  template: `
    <header class="gaia-header">
      <gaia-brand />
      <gaia-preferences />
    </header>
    <main>
      <nav [attr.aria-label]="text().tools">
        <a routerLink="/rox">GaiaRox <span>{{ text().timing }}</span></a>
        <a routerLink="/rox/admin">GaiaRox — {{ text().admin }} <span>{{ text().manage }}</span></a>
        <a routerLink="/scores">GaiaScores <span>{{ text().scores }}</span></a>
      </nav>
    </main>
  `,
  styles: `
    :host { --text: #17231b; --bg: #f3f7f2; --surface: #fff; --header: #173f2a; --header-text: #fff; --header-muted: #dceae0; --accent: #10643b; --on-accent: #fff; --border: #cad8ce; --shadow: rgb(20 54 34 / 15%); display: block; min-height: 100vh; background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; }
    :host([data-theme='basque']) { --text: #2a1d17; --bg: #faf6f1; --header: #4a171e; --header-muted: #f3dfe1; --accent: #c8102e; --border: #e4d1cb; }
    :host([data-theme='ocean']) { --text: #182636; --bg: #f2f7fb; --header: #15334f; --header-muted: #dceaf5; --accent: #1769aa; --border: #cbd9e5; }
    :host([data-theme='purple']) { --text: #29223a; --bg: #f7f5fb; --header: #38264f; --header-muted: #e9e0f3; --accent: #6b46c1; --border: #d9d1e8; }
    :host([data-theme='sunset']) { --text: #33231b; --bg: #fcf6f1; --header: #512913; --header-muted: #f3e4d6; --accent: #c2410c; --border: #e8d5c6; }
    :host([data-theme='dark']) { --text: #e5e7eb; --bg: #111827; --surface: #1f2937; --header: #0b1220; --header-muted: #cbd5e1; --accent: #60a5fa; --on-accent: #0b1220; --border: #374151; --shadow: rgb(0 0 0 / 35%); }
    main { max-width: 48rem; padding: 2rem; margin: auto; }
    nav { display: grid; gap: 1rem; }
    nav a { display: block; padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: .5rem; color: inherit; font-weight: 600; }
    nav span { display: block; margin-top: .25rem; font-weight: 400; }
  `,
})
export class Home {
  protected readonly preferences = inject(PreferencesService);

  protected text() {
    return TEXT[this.preferences.language()];
  }
}

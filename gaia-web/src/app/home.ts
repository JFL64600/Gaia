import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreferencesControls } from './preferences/preferences-controls';
import { PreferencesService } from './preferences/preferences.service';
import { GaiaBrand } from './gaia-brand';

const TEXT = {
  fr: { tools: 'Outils Gaia' },
  eu: { tools: 'Gaia tresnak' },
} as const;

@Component({
  imports: [RouterLink, PreferencesControls, GaiaBrand],
  host: { '[attr.data-theme]': 'preferences.theme()' },
  template: `
    <header class="gaia-header">
      <gaia-brand />
      <gaia-preferences [showModeToggle]="true" />
    </header>
    <main>
      <nav [attr.aria-label]="text().tools">
        <a routerLink="/rox">
          <img src="images/home-rox.svg" alt="" />
          <span class="tile-label"><strong>GaiaRox</strong></span>
          <span class="tile-arrow" aria-hidden="true">↗</span>
        </a>
        <a routerLink="/scores">
          <img src="images/home-scores.svg" alt="" />
          <span class="tile-label"><strong>GaiaScores</strong></span>
          <span class="tile-arrow" aria-hidden="true">↗</span>
        </a>
      </nav>
    </main>
  `,
  styles: `
    :host { --text: #17231b; --bg: #f3f7f2; --header: #173f2a; --header-text: #fff; --header-muted: #dceae0; --accent: #10643b; --on-accent: #fff; --shadow: rgb(20 54 34 / 15%); display: block; min-height: 100vh; background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; }
    :host([data-theme='basque']) { --text: #2a1d17; --bg: #faf6f1; --header: #4a171e; --header-muted: #f3dfe1; --accent: #c8102e; }
    :host([data-theme='ocean']) { --text: #182636; --bg: #f2f7fb; --header: #15334f; --header-muted: #dceaf5; --accent: #1769aa; }
    :host([data-theme='purple']) { --text: #29223a; --bg: #f7f5fb; --header: #38264f; --header-muted: #e9e0f3; --accent: #6b46c1; }
    :host([data-theme='sunset']) { --text: #33231b; --bg: #fcf6f1; --header: #512913; --header-muted: #f3e4d6; --accent: #c2410c; }
    :host([data-theme='dark']) { --text: #e5e7eb; --bg: #111827; --header: #0b1220; --header-muted: #cbd5e1; --accent: #60a5fa; --on-accent: #0b1220; --shadow: rgb(0 0 0 / 35%); }
    main { max-width: 68rem; padding: 2rem; margin: auto; }
    nav { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.125rem; }
    nav a { position: relative; flex: 0 1 calc((100% - 1.125rem) / 2); aspect-ratio: 1.45; overflow: hidden; border-radius: .75rem; background: #244e39; color: #fff; text-decoration: none; box-shadow: 0 .45rem 1.25rem var(--shadow); }
    nav:has(> a:nth-child(3)) a { flex-basis: calc((100% - 2.25rem) / 3); }
    nav a:focus-visible { outline: .2rem solid var(--accent); outline-offset: .25rem; }
    nav img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .tile-label { position: absolute; inset: auto 0 0; padding: 4rem 1.5rem 1.4rem; background: linear-gradient(transparent, #071b17e8); }
    .tile-label strong { font-size: clamp(1.4rem, 3vw, 2.3rem); letter-spacing: -.03em; }
    .tile-arrow { position: absolute; right: 1.5rem; bottom: 1.5rem; font-size: 1.4rem; }
    @media (max-width: 50rem) { nav:has(> a:nth-child(3)) a { flex-basis: calc((100% - 1.125rem) / 2); } }
    @media (max-width: 37rem) {
      main { padding: 1.25rem; }
      nav a, nav:has(> a:nth-child(3)) a { flex-basis: 100%; }
    }
  `,
})
export class Home {
  protected readonly preferences = inject(PreferencesService);

  protected text() {
    return TEXT[this.preferences.language()];
  }
}

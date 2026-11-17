import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreferencesControls } from '../../preferences/preferences-controls';
import { GaiaBrand } from '../../gaia-brand';
import { attachToolStyles } from '../../tool-styles';

@Component({
  imports: [RouterOutlet, PreferencesControls, GaiaBrand],
  template: `
    <div class="app-shell">
      <header class="gaia-header">
        <div class="gaia-header-group">
          <gaia-brand name="Andde" suffix="XokoTxapelketa" toolLink="/axt" />
        </div>
        <div class="gaia-header-controls">
          <gaia-preferences />
        </div>
      </header>
      <router-outlet />
    </div>
  `,
})
export class App {
  constructor() {
    attachToolStyles('styles/axt/styles.css', inject(DestroyRef));
  }
}

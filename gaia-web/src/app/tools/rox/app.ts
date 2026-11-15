import { Component, computed, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { RANKING_STYLES, RankingStyleService } from './core/ranking-style.service';
import { ChronometerStore } from './core/chronometer.store';
import { I18n } from './core/i18n.service';
import { attachToolStyles } from '../../tool-styles';
import { PreferencesControls } from '../../preferences/preferences-controls';
import { GaiaBrand } from '../../gaia-brand';
import { DisplayModeService } from '../../preferences/display-mode.service';

@Component({
  imports: [RouterOutlet, PreferencesControls, GaiaBrand],
  selector: 'app-rox',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly i18n = inject(I18n);
  protected readonly chronometerStore = inject(ChronometerStore);
  protected readonly rankingService = inject(RankingStyleService);
  protected readonly rankingStyles = RANKING_STYLES;
  private readonly mode = inject(DisplayModeService);

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly showRankingPicker = computed(
    () => !this.mode.admin() && !this.rankingService.mobile() && /^\/rox\/events\/[^/?#]+/.test(this.url()),
  );

  constructor() {
    attachToolStyles('styles/rox/styles.css', inject(DestroyRef));
  }

  protected async copyLink(): Promise<void> {
    const url = new URL(globalThis.location.href);
    await navigator.clipboard?.writeText(url.toString());
  }

}

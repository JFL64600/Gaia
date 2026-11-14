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

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly showRankingPicker = computed(
    () => !this.rankingService.mobile() && /^\/rox\/view\/events\/[^/?#]+/.test(this.url()),
  );

  constructor() {
    attachToolStyles('styles/rox/styles.css', inject(DestroyRef));
  }

  protected async copyLink(): Promise<void> {
    const url = new URL(globalThis.location.href);
    url.pathname = url.pathname.replace(/\/rox\/admin(?=\/|$)/, '/rox/view');
    await navigator.clipboard?.writeText(url.toString());
  }

}

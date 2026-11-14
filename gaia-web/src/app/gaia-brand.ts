import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'gaia-brand',
  imports: [RouterLink],
  template: `
    <span class="gaia-brand">
      <a class="gaia-brand-mark" routerLink="/" aria-label="Gaia">G</a>
      <span>Gaia<span class="gaia-brand-suffix">{{ suffix() }}</span></span>
    </span>
  `,
})
export class GaiaBrand {
  readonly suffix = input('');
}

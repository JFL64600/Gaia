import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'gaia-brand',
  imports: [RouterLink],
  template: `
    <span class="gaia-brand">
      <a class="gaia-brand-mark" routerLink="/" aria-label="Gaia">G</a>
      @if (toolLink()) {
        <a class="gaia-brand-name" [routerLink]="toolLink()">{{ name() }}<span class="gaia-brand-suffix">{{ suffix() }}</span></a>
      } @else {
        <span>{{ name() }}<span class="gaia-brand-suffix">{{ suffix() }}</span></span>
      }
    </span>
  `,
})
export class GaiaBrand {
  readonly name = input('Gaia');
  readonly suffix = input('');
  readonly toolLink = input('');
}

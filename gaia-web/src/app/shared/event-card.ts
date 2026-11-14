import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'li[gaia-event-card]',
  imports: [NgTemplateOutlet, RouterLink],
  template: `
    <div class="event-tile">
      <ng-template #details>
        <span class="tile-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="3.5" y="5" width="17" height="16" rx="2.5"></rect>
            <path d="M7.5 3v4M16.5 3v4M4 9.5h16"></path>
            <path d="m9 14 2 2 4-4"></path>
          </svg>
        </span>
        <span class="tile-details">
          <strong>{{ name() }}</strong>
          @if (description()) {
            <small>{{ description() }}</small>
          }
        </span>
      </ng-template>
      @if (link(); as url) {
        <a class="event-link" [routerLink]="url" [attr.aria-label]="openLabel()">
          <ng-container [ngTemplateOutlet]="details" />
        </a>
      } @else {
        <div class="tile-content">
          <ng-container [ngTemplateOutlet]="details" />
        </div>
      }
      @if (deleteLabel(); as label) {
        <button class="delete-button" type="button" [attr.aria-label]="label"
          (click)="remove.emit()">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 7h12l-1 13H7L6 7zm3-4h6l1 2h4v2H4V5h4l1-2z" />
          </svg>
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; min-width: 0; }
    .event-tile { box-sizing: border-box; display: flex; min-height: 5.25rem; align-items: center; gap: 1rem; padding: 1rem 1.2rem; border: 1px solid var(--border); border-radius: .9rem; background: var(--surface); box-shadow: 0 .25rem .8rem var(--shadow); transition: border-color 120ms ease, transform 120ms ease; }
    .event-tile:hover { transform: translateY(-1px); border-color: var(--border-strong); }
    .event-link, .tile-content { display: flex; min-width: 0; flex: 1; align-items: center; gap: 1rem; color: inherit; text-decoration: none; }
    .tile-icon { display: grid; width: 2.8rem; aspect-ratio: 1; flex: 0 0 auto; place-items: center; border-radius: .75rem; background: var(--accent-soft); color: var(--accent); }
    .tile-icon svg { width: 1.4rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.7; }
    .tile-details { display: grid; min-width: 0; flex: 1; gap: .3rem; }
    strong { overflow: hidden; color: var(--text); font-size: .98rem; text-overflow: ellipsis; white-space: nowrap; }
    small { overflow-wrap: anywhere; color: var(--muted); font-size: .78rem; }
    .delete-button { display: inline-flex; flex: 0 0 auto; width: 2.75rem; height: 2.75rem; align-items: center; justify-content: center; padding: .6rem; border: 1px solid var(--border); border-radius: .7rem; background: var(--surface); color: var(--danger); cursor: pointer; }
    .delete-button:hover { background: var(--danger-bg); border-color: var(--danger); }
    .delete-button svg { width: 1.25rem; fill: currentColor; }
    a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  `,
})
export class EventCard {
  readonly name = input.required<string>();
  readonly description = input<string | null>(null);
  readonly link = input<string | null>(null);
  readonly openLabel = input<string | null>(null);
  readonly deleteLabel = input<string | null>(null);
  readonly remove = output<void>();
}

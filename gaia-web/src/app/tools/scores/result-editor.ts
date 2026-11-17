import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { Game } from './core/games';
import { I18n } from './core/i18n.service';
import { ResultsRemote, ResultValue } from './core/results.remote';

@Component({
  selector: 'gaia-result-editor',
  template: `
    <form class="editor" (submit)="save($event)">
      <input
        [attr.aria-label]="i18n.t('results.edit', { team: teamName(), game: game().label })"
        [attr.inputmode]="game().role === 'Point' ? 'decimal' : 'text'"
        [placeholder]="game().role === 'Time' ? i18n.t('results.timeHint') : '0'"
        [value]="draft()"
        [disabled]="saving()"
        (input)="change($event)"
      />
      <button type="submit" [disabled]="!dirty() || saving()">
        {{ i18n.t(saving() ? 'results.saving' : 'results.save') }}
      </button>
    </form>
    @if (error(); as message) {
      <p class="editor-error" role="alert">{{ message }}</p>
    }
  `,
  styles: `
    .editor { display:flex; gap:.4rem; align-items:center; }
    input { min-width:0; width:7rem; padding:.55rem; border:1px solid var(--border-strong); border-radius:.5rem; background:var(--surface); color:var(--text); font:inherit; }
    button { padding:.55rem; border:1px solid var(--accent); border-radius:.5rem; background:var(--accent); color:var(--on-accent); font:inherit; cursor:pointer; }
    button:disabled { opacity:.55; cursor:default; }
    .editor-error { color:var(--danger); font-size:.8rem; margin:.4rem 0 0; overflow-wrap:anywhere; }
  `,
})
export class ResultEditor {
  readonly eventId = input.required<string>();
  readonly teamId = input.required<string>();
  readonly teamName = input.required<string>();
  readonly game = input.required<Game>();
  readonly value = input<ResultValue | null>(null);

  protected readonly i18n = inject(I18n);
  private readonly remote = inject(ResultsRemote);
  protected readonly draft = signal('');
  protected readonly dirty = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const value = this.value();
      if (!untracked(this.dirty)) this.draft.set(value === null ? '' : String(value));
    });
  }

  protected change(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
    this.dirty.set(true);
    this.error.set(null);
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.dirty() || this.saving()) return;
    const text = this.draft().trim();
    let value: ResultValue | null = null;
    if (text && this.game().role === 'Time') {
      if (!/^\d+:[0-5]\d(?:[.,]\d{1,3})?$/.test(text)) {
        this.error.set(this.i18n.t('results.invalidTime'));
        return;
      }
      value = text.replace(',', '.');
    } else if (text) {
      if (!/^\d+(?:[.,]\d+)?$/.test(text) || !Number.isFinite(Number(text.replace(',', '.')))) {
        this.error.set(this.i18n.t('results.invalidPoints'));
        return;
      }
      value = Number(text.replace(',', '.'));
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      await this.remote.save(this.eventId(), this.teamId(), this.game().code, value);
      this.draft.set(value === null ? '' : String(value));
      this.dirty.set(false);
    } catch (error) {
      this.error.set(this.i18n.t('results.notSaved', {
        error: error instanceof Error ? error.message : String(error),
      }));
    } finally {
      this.saving.set(false);
    }
  }
}

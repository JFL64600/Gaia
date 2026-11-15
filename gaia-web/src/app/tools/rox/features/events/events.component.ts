import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EVENT_NAME_MAX_LENGTH, EventStore } from '../../core/event.store';
import { I18n } from '../../core/i18n.service';
import { EventListItem, EventsPage } from '../../../../shared/events-page';
import { EventCreation } from '../../../../shared/event-creation';

@Component({
  selector: 'app-events',
  imports: [EventsPage, EventCreation],
  templateUrl: './events.component.html',
})
export class EventsComponent {
  protected readonly store = inject(EventStore);
  protected readonly i18n = inject(I18n);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly readonly = this.route.snapshot.data['readonly'] === true;
  protected readonly base = this.readonly ? '/rox/view' : '/rox/admin';

  protected readonly nameMaxLength = EVENT_NAME_MAX_LENGTH;
  protected readonly creating = signal(false);
  protected readonly pendingName = signal('');
  protected readonly pendingResumeEnabled = signal(false);
  protected readonly canCreate = computed(() => this.pendingName().trim() !== '');
  protected readonly events = computed<readonly EventListItem[]>(() =>
    this.store.events().map((event) => ({
      id: event.id,
      name: event.name,
      link: this.base + '/events/' + event.id,
      openLabel: this.i18n.t('events.open', { name: event.name }),
      deleteLabel: this.readonly ? undefined : this.i18n.t('events.delete', { name: event.name }),
    })),
  );

  protected startCreating(): void {
    this.pendingName.set('');
    this.pendingResumeEnabled.set(false);
    this.creating.set(true);
  }

  protected cancelCreating(): void {
    this.creating.set(false);
  }

  protected updateName(name: string): void {
    this.pendingName.set(name);
  }

  protected toggleResumeEnabled(): void {
    this.pendingResumeEnabled.update((enabled) => !enabled);
  }

  protected create(event?: Event): void {
    event?.preventDefault();
    const created = this.store.create(this.pendingName(), this.pendingResumeEnabled());
    if (created) {
      this.creating.set(false);
      void this.router.navigate([this.base, 'events', created.id]);
    }
  }

  protected remove(id: string, name: string): void {
    if (globalThis.confirm?.(this.i18n.t('events.confirmDelete', { name })) ?? true) {
      this.store.remove(id);
    }
  }
}

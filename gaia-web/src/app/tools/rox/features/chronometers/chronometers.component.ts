import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventStore } from '../../core/event.store';
import { ChronometerStore } from '../../core/chronometer.store';
import { I18n } from '../../core/i18n.service';
import { FIREBASE_OPTIONS } from '../../core/firebase.token';
import { LiveElapsedPipe } from '../../core/live-elapsed.pipe';
import { RankingComponent } from '../ranking/ranking.component';
import { DisplayModeService } from '../../../../preferences/display-mode.service';

export const CHRONOMETER_NAME_MAX_LENGTH = 40;
const LEAVE_MS = 600;

@Component({
  selector: 'app-chronometers',
  imports: [LiveElapsedPipe, RankingComponent],
  styleUrl: './chronometers.component.css',
  templateUrl: './chronometers.component.html',
})
export class ChronometersComponent {
  protected readonly store = inject(ChronometerStore);
  protected readonly i18n = inject(I18n);
  private readonly injector = inject(Injector);
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  private readonly eventId: string;
  protected readonly events = inject(EventStore);
  private readonly mode = inject(DisplayModeService);
  protected readonly readonly = computed(() => !this.mode.admin());
  protected readonly nameMaxLength = CHRONOMETER_NAME_MAX_LENGTH;
  protected readonly naming = signal(false);
  protected readonly pendingName = signal('');
  protected readonly trimmedName = computed(() => this.pendingName().trim());
  protected readonly duplicateName = computed(() => {
    const candidate = this.trimmedName().toLocaleLowerCase();
    return (
      candidate !== '' &&
      this.store.chronometers().some(({ name }) => name.toLocaleLowerCase() === candidate)
    );
  });
  protected readonly canConfirmName = computed(
    () => this.trimmedName() !== '' && !this.duplicateName(),
  );

  constructor() {
    effect(() => this.trackFinished());
    effect(() => {
      if (this.readonly()) {
        this.cancelName();
      }
    });
    const eventId = inject(ActivatedRoute).snapshot.paramMap.get('id');
    if (eventId === null) {
      throw new Error('Chronometer route requires an event id.');
    }
    this.eventId = eventId;
    const event = this.events.find(eventId) ?? this.events.join(eventId);
    this.store.openEvent(event && event.name !== eventId ? event.name : null);
    if (inject(FIREBASE_OPTIONS) !== null) {
      this.store.joinRoom(eventId);
    }
    inject(DestroyRef).onDestroy(() => this.store.openEvent());
  }

  protected requestName(): void {
    if (this.readonly()) return;
    this.pendingName.set('');
    this.naming.set(true);
    afterNextRender(() => this.nameInput()?.nativeElement.focus(), { injector: this.injector });
  }

  protected updateName(event: Event): void {
    this.pendingName.set((event.target as HTMLInputElement).value);
  }

  protected confirmName(event?: Event): void {
    event?.preventDefault();
    if (this.readonly() || !this.canConfirmName()) {
      return;
    }

    this.store.add(this.trimmedName());
    this.cancelName();
  }

  protected cancelName(): void {
    this.naming.set(false);
    this.pendingName.set('');
  }
  protected stop(id: string): void {
    if (this.readonly()) return;
    this.store.stop(id);
  }

  protected start(id: string): void {
    if (this.readonly()) return;
    this.store.startOne(id);
  }

  protected resume(id: string): void {
    if (this.readonly()) return;
    this.store.resumeOne(id);
  }

  protected readonly leaving = signal<ReadonlySet<string>>(new Set());
  private visibleIds = new Set<string>();

  protected readonly started = computed(() =>
    this.store.chronometers().length > 0,
  );
  protected readonly visibleChronometers = computed(() =>
    this.readonly()
      ? this.store
          .chronometers()
          .filter(
            ({ id, status, startInstant }) =>
              !(status === 'stopped' && startInstant !== null) || this.leaving().has(id),
          )
      : this.store.chronometers(),
  );

  private trackFinished(): void {
    if (!this.readonly()) {
      this.visibleIds = new Set();
      untracked(() => this.leaving.set(new Set()));
      return;
    }
    const current = this.store.chronometers();
    const nowVisible = new Set<string>();
    const finished: string[] = [];
    for (const { id, status, startInstant } of current) {
      if (status === 'stopped' && startInstant !== null) {
        if (this.visibleIds.has(id)) {
          finished.push(id);
        }
      } else {
        nowVisible.add(id);
      }
    }
    this.visibleIds = nowVisible;
    if (finished.length === 0) {
      return;
    }
    untracked(() => this.leaving.update((set) => new Set([...set, ...finished])));
    setTimeout(
      () =>
        this.leaving.update((set) => new Set([...set].filter((id) => !finished.includes(id)))),
      LEAVE_MS,
    );
  }

  protected showResume(): boolean {
    return this.events.find(this.eventId)?.resumeEnabled === true;
  }
}

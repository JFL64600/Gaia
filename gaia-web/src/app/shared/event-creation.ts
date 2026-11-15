import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'gaia-event-creation',
  templateUrl: './event-creation.html',
})
export class EventCreation {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly nameLabel = input.required<string>();
  readonly namePlaceholder = input.required<string>();
  readonly nameMaxLength = input.required<number>();
  readonly nameValue = input.required<string>();
  readonly nameDisabled = input(false);
  readonly focusName = input(false);
  readonly submitLabel = input.required<string>();
  readonly cancelLabel = input.required<string>();
  readonly submitDisabled = input(false);
  readonly cancelDisabled = input(false);
  readonly save = output<void>();
  readonly cancel = output<void>();
  readonly nameChange = output<string>();

  private readonly injector = inject(Injector);
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  constructor() {
    afterNextRender(() => {
      if (this.focusName()) this.nameInput()?.nativeElement.focus();
    }, { injector: this.injector });
  }

  protected onNameInput(event: Event): void {
    this.nameChange.emit((event.target as HTMLInputElement).value);
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.save.emit();
  }
}

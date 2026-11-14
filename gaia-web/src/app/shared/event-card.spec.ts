import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { EventCard } from './event-card';

@Component({
  imports: [EventCard],
  template: `
    <ul>
      <li gaia-event-card name="Tournoi" link="/rox/admin/events/test-event"
        openLabel="Ouvrir Tournoi" [deleteLabel]="deletable ? 'Supprimer Tournoi' : null"
        (remove)="onRemove()"></li>
      <li gaia-event-card name="Rencontre"></li>
    </ul>
  `,
})
class Host {
  deletable = true;
  onRemove = vi.fn();
}

describe('EventCard', () => {
  it('emits deletion without opening the event and hides the optional delete button', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const button = element.querySelector<HTMLButtonElement>('.delete-button')!;
    expect(button.getAttribute('aria-label')).toBe('Supprimer Tournoi');
    expect(button.closest('a')).toBeNull();
    button.click();
    expect(fixture.componentInstance.onRemove).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe('/');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/rox/admin/events/test-event');

    fixture.componentInstance.deletable = false;
    fixture.detectChanges();
    expect(element.querySelector('.delete-button')).toBeNull();
  });

  it('renders a non-interactive card when the tool provides no actions', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const card = (fixture.nativeElement as HTMLElement).querySelectorAll('[gaia-event-card]')[1];
    expect(card.querySelector('strong')?.textContent).toBe('Rencontre');
    expect(card.querySelector('a, button')).toBeNull();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PreferencesService } from '../preferences/preferences.service';
import { resetLocalStorage } from '../tools/rox/core/testing-storage';
import { EventsPage } from './events-page';

describe('EventsPage', () => {
  let fixture: ComponentFixture<EventsPage>;
  let element: HTMLElement;

  beforeEach(() => {
    resetLocalStorage();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(EventsPage);
    element = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('events', [
      { id: 'one', name: 'Tournoi Gaia' },
      { id: 'two', name: 'Rencontre' },
    ]);
    fixture.detectChanges();
  });

  it('filters names, updates the count and shows no-results feedback in the selected language', () => {
    const search = element.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = '  TOURNOI ';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.querySelectorAll('[gaia-event-card]')).toHaveLength(1);
    expect(element.querySelector('.event-count')?.textContent).toBe('1 évènement');
    expect(element.querySelector('.event-list')?.textContent).toContain('Tournoi Gaia');

    search.value = 'inconnu';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.querySelector('.empty-state h2')?.textContent).toBe('Aucun évènement trouvé');
    expect(element.querySelector('.event-count')?.textContent).toBe('0 évènements');

    TestBed.inject(PreferencesService).setLanguage('eu');
    fixture.detectChanges();
    expect(element.querySelector('h1')?.textContent).toBe('Ekitaldiak');
    expect(element.querySelector('.empty-state h2')?.textContent).toBe('Ez da ekitaldirik aurkitu');
  });

  it('emits creation requests and hides every creation entry in read-only or creating mode', () => {
    const create = vi.fn();
    fixture.componentInstance.create.subscribe(create);
    element.querySelector<HTMLButtonElement>('.create-button')!.click();
    expect(create).toHaveBeenCalledOnce();

    fixture.componentRef.setInput('events', []);
    fixture.componentRef.setInput('creating', true);
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeNull();

    fixture.componentRef.setInput('creating', false);
    fixture.componentRef.setInput('canCreate', false);
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeNull();
    expect(element.querySelector('.empty-state')?.textContent).toContain('Les évènements disponibles apparaîtront ici.');
  });

  it('shows loading and errors without replacing an available list with an empty state', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Chargement');
    expect(element.querySelector('.event-list')).toBeNull();

    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', 'permission-denied');
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('permission-denied');
    expect(element.querySelectorAll('[gaia-event-card]')).toHaveLength(2);

    fixture.componentRef.setInput('events', []);
    fixture.detectChanges();
    expect(element.querySelector('.empty-state h2')?.textContent).toBe('La connexion à Firebase a échoué.');
  });
});

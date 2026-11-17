import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { DisplayModeService } from '../../preferences/display-mode.service';
import { EventStore } from './core/event.store';
import { ResultTeam, ResultsRemote } from './core/results.remote';
import { Results } from './results';

const teams: ResultTeam[] = [
  { id: '1', name: '1', gameIds: ['time', 'points'], scores: { time: '02:14', points: 0 } },
  { id: '2', name: '2', gameIds: ['time', 'points'], scores: {} },
];

describe('Scores results', () => {
  const save = vi.fn();

  beforeEach(async () => {
    save.mockReset().mockResolvedValue(undefined);
    await TestBed.configureTestingModule({
      imports: [Results],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: 'event-1' })) } },
        { provide: EventStore, useValue: {
          loading: signal(false), error: signal(null),
          games: signal([
            { code: 'time', label: 'Parcours', role: 'Time' },
            { code: 'points', label: 'Précision', role: 'Point' },
          ]),
        } },
        { provide: ResultsRemote, useValue: {
          watchEvent: (_id: string, next: (event: unknown) => void) => {
            next({ name: 'Tournoi', gameIds: ['time', 'points'] });
            return () => undefined;
          },
          watchTeams: (_id: string, next: (teams: ResultTeam[]) => void) => {
            next(teams);
            return () => undefined;
          },
          save,
        } },
      ],
    }).compileComponents();
  });

  it('shows unranked results to spectators and a separate pending ranking', async () => {
    const fixture = TestBed.createComponent(Results);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Tournoi');
    expect(element.querySelector('.gaia-header .event-title')?.textContent).toContain('Tournoi');
    expect(element.querySelector('main')?.textContent).not.toContain('Tournoi');
    expect(element.querySelector('main a')).toBeNull();
    expect(element.textContent).toContain('02:14');
    expect(element.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(element.querySelectorAll('input')).toHaveLength(0);
    expect(element.querySelectorAll('.empty-result')).toHaveLength(2);
    const cells = element.querySelectorAll('tbody tr:first-child td');
    expect(cells[1].textContent?.trim()).toBe('0');
    element.querySelectorAll<HTMLButtonElement>('.tabs button')[1].click();
    fixture.detectChanges();
    expect(element.textContent).toContain('lorsque ses règles seront définies');
    expect(element.querySelector('table')).toBeNull();
  });

  it('lets admins save and clear individual results and reports failures', async () => {
    TestBed.inject(DisplayModeService).setAdmin(true);
    const fixture = TestBed.createComponent(Results);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const editors = element.querySelectorAll<HTMLElement>('gaia-result-editor');
    const input = editors[1].querySelector<HTMLInputElement>('input')!;
    input.value = '12,5';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    editors[1].querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(save).toHaveBeenCalledWith('event-1', '1', 'points', 12.5);

    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    editors[1].querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(save).toHaveBeenLastCalledWith('event-1', '1', 'points', null);

    save.mockRejectedValueOnce(new Error('permission-denied'));
    input.value = '3';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    editors[1].querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(editors[1].querySelector('[role="alert"]')?.textContent).toContain('permission-denied');
    expect(input.value).toBe('3');
  });

  it('rejects invalid time and removes editing controls when admin is disabled', async () => {
    const mode = TestBed.inject(DisplayModeService);
    mode.setAdmin(true);
    const fixture = TestBed.createComponent(Results);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const editor = element.querySelector<HTMLElement>('gaia-result-editor')!;
    const input = editor.querySelector<HTMLInputElement>('input')!;
    input.value = '01:75';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    editor.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(editor.querySelector('[role="alert"]')?.textContent).toContain('minutes:secondes');
    expect(save).not.toHaveBeenCalled();
    mode.setAdmin(false);
    fixture.detectChanges();
    expect(element.querySelector('gaia-result-editor')).toBeNull();
  });
});

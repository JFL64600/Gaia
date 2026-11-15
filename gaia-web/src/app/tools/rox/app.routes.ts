import { Routes } from '@angular/router';

const eventsPage = () =>
  import('./features/events/events.component').then(({ EventsComponent }) => EventsComponent);
const chronometersPage = () =>
  import('./features/chronometers/chronometers.component').then(
    ({ ChronometersComponent }) => ChronometersComponent,
  );

export const routes: Routes = [
  { path: 'events', loadComponent: eventsPage },
  { path: 'events/:id', loadComponent: chronometersPage },
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: '**', redirectTo: 'events' },
];

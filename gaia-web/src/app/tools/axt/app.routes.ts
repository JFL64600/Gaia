import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'events',
    loadComponent: () => import('./events.component').then((m) => m.EventsComponent),
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./event.component').then((m) => m.EventComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  { path: '**', redirectTo: 'events' },
];

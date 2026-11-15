import { inject } from '@angular/core';
import { CanActivateChildFn, Router, Routes } from '@angular/router';
import { DisplayModeService } from '../../preferences/display-mode.service';

const matchDisplayMode: CanActivateChildFn = (route, state) => {
  const admin = inject(DisplayModeService).admin();
  if (route.data['readonly'] === !admin) {
    return true;
  }
  return inject(Router).parseUrl(
    state.url.replace(/(^|\/)(?:admin|view)(?=\/|[?#]|$)/, `$1${admin ? 'admin' : 'view'}`),
  );
};

const eventsPage = () =>
  import('./features/events/events.component').then(({ EventsComponent }) => EventsComponent);
const chronometersPage = () =>
  import('./features/chronometers/chronometers.component').then(
    ({ ChronometersComponent }) => ChronometersComponent,
  );

export const routes: Routes = [
  {
    path: 'admin',
    data: { readonly: false },
    canActivateChild: [matchDisplayMode],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'events' },
      { path: 'events', loadComponent: eventsPage },
      { path: 'events/:id', loadComponent: chronometersPage },
    ],
  },
  {
    path: 'view',
    data: { readonly: true },
    canActivateChild: [matchDisplayMode],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'events' },
      { path: 'events', loadComponent: eventsPage },
      { path: 'events/:id', loadComponent: chronometersPage },
    ],
  },
  { path: 'events', pathMatch: 'full', redirectTo: 'view/events' },
  { path: 'events/:id', redirectTo: 'view/events/:id' },
  { path: '', pathMatch: 'full', redirectTo: 'view' },
  { path: '**', redirectTo: 'view' },
];

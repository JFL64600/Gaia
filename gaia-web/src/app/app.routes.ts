import { Routes } from '@angular/router';
import { routes as roxRoutes } from './tools/rox/app.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home').then((m) => m.Home),
  },
  {
    path: 'rox',
    loadComponent: () => import('./tools/rox/app').then((m) => m.App),
    children: roxRoutes,
  },
  {
    path: 'scores',
    loadComponent: () => import('./tools/scores/app').then((m) => m.App),
  },
  { path: 'admin/events/:id', redirectTo: 'rox/admin/events/:id' },
  { path: 'admin', redirectTo: 'rox/admin', pathMatch: 'full' },
  { path: 'admin/events', redirectTo: 'rox/admin/events', pathMatch: 'full' },
  { path: 'view/events/:id', redirectTo: 'rox/view/events/:id' },
  { path: 'view', redirectTo: 'rox/view', pathMatch: 'full' },
  { path: 'view/events', redirectTo: 'rox/view/events', pathMatch: 'full' },
  { path: 'events/:id', redirectTo: 'rox/view/events/:id' },
  { path: 'events', redirectTo: 'rox/view/events', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

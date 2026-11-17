import { Routes } from '@angular/router';
import { routes as roxRoutes } from './tools/rox/app.routes';
import { routes as axtRoutes } from './tools/axt/app.routes';

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
    path: 'scores/events/:id',
    loadComponent: () => import('./tools/scores/results').then((m) => m.Results),
  },
  {
    path: 'scores',
    loadComponent: () => import('./tools/scores/app').then((m) => m.App),
  },
  {
    path: 'axt',
    loadComponent: () => import('./tools/axt/app').then((m) => m.App),
    children: axtRoutes,
  },
  { path: '**', redirectTo: '' },
];

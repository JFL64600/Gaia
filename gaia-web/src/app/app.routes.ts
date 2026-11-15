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
  { path: '**', redirectTo: '' },
];

import { Routes } from '@angular/router';
import { Dash } from './pages/dash/dash';

export const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  { path: 'dash', component: Dash }
];

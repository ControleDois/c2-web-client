import { Routes } from '@angular/router';
import { Dash } from './pages/dash/dash';
import { CompanySelection } from './pages/company-selection/company-selection';

export const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  { path: 'dash', component: Dash },
  { path: 'company-selection', component: CompanySelection }
];

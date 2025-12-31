import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';
import { CompanySelection } from './pages/company-selection/company-selection';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SignIn },
  { path: 'company-selection', component: CompanySelection }
];

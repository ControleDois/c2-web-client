import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';
import { CompanySelection } from './pages/company-selection/company-selection';
import { AuthResolver } from '../../core/auth/auth.resolver';
import { AuthGuard } from '../../core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SignIn, canActivate: [AuthGuard] },
  { path: 'company-selection', component: CompanySelection, resolve: [ AuthResolver] }
];

import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SignIn }
];

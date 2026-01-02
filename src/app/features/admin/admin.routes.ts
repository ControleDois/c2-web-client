import { Routes } from '@angular/router';
import { Dash } from './pages/dash/dash';
import { PeopleList } from './pages/people/people-list/people-list';
import { PeopleForm } from './pages/people/people-form/people-form';

export const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  { path: 'dash', component: Dash },
  { path: 'people', component: PeopleList},
  { path: 'people/:id', component: PeopleForm}
];

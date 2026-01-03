import { Routes } from '@angular/router';
import { Dash } from './pages/dash/dash';
import { PeopleList } from './pages/people/people-list/people-list';
import { PeopleForm } from './pages/people/people-form/people-form';
import { appTitleResolver } from '../../core/resolvers/app-title.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  { path: 'dash', component: Dash, data: { title: 'Dashboard' } },
  { path: 'people', data: { title: 'Pessoas' }, children: [
    { path: '', component: PeopleList, data: { title: null} },
    { path: ':id', component: PeopleForm, resolve: { title: appTitleResolver }, data: { entityName: 'Pessoas' }}
  ]},
];

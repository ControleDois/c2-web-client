import { Routes } from '@angular/router';
import { Dash } from './pages/dash/dash';
import { PeopleList } from './pages/people/people-list/people-list';
import { PeopleForm } from './pages/people/people-form/people-form';
import { appTitleResolver } from '../../core/resolvers/app-title.resolver';
import { ProductList } from './pages/product/product-list/product-list';
import { ProductForm } from './pages/product/product-form/product-form';

export const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  { path: 'dash', component: Dash, data: { title: 'Dashboard' } },
  { path: 'people', data: { title: 'Pessoas' }, children: [
    { path: '', component: PeopleList, data: { title: null} },
    { path: ':id', component: PeopleForm, resolve: { title: appTitleResolver }, data: { entityName: 'Pessoas' }}
  ]},
  { path: 'product', data: { title: 'Produtos' }, children: [
    { path: '', component: ProductList, data: { title: null} },
    { path: ':id', component: ProductForm, resolve: { title: appTitleResolver }, data: { entityName: 'Produtos' }}
  ]}
];

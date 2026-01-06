import { Routes } from '@angular/router';
import { Dash } from './pages/dash/dash';
import { PeopleList } from './pages/people/people-list/people-list';
import { PeopleForm } from './pages/people/people-form/people-form';
import { appTitleResolver } from '../../core/resolvers/app-title.resolver';
import { ProductList } from './pages/product/product-list/product-list';
import { ProductForm } from './pages/product/product-form/product-form';
import { ServiceList } from './pages/service/service-list/service-list';
import { ServiceForm } from './pages/service/service-form/service-form';
import { CategoryList } from './pages/category/category-list/category-list';
import { CategoryForm } from './pages/category/category-form/category-form';

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
  ]},
  { path: 'service', data: { title: 'Serviços' }, children: [
    { path: '', component: ServiceList, data: { title: null} },
    { path: ':id', component: ServiceForm, resolve: { title: appTitleResolver }, data: { entityName: 'Serviços' }}
  ]},
  { path: 'category', data: { title: 'Categorias' }, children: [
    { path: '', component: CategoryList, data: { title: null} },
    { path: ':id', component: CategoryForm, resolve: { title: appTitleResolver }, data: { entityName: 'Categorias' }}
  ]}
];

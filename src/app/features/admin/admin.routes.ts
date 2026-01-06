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
import { CostCenterList } from './pages/cost-center/cost-center-list/cost-center-list';
import { CostCenterForm } from './pages/cost-center/cost-center-form/cost-center-form';
import { ContactList } from './pages/contact/contact-list/contact-list';
import { ContactForm } from './pages/contact/contact-form/contact-form';
import { BankList } from './pages/bank/bank-list/bank-list';
import { BankForm } from './pages/bank/bank-form/bank-form';
import { BillReceivementList } from './pages/bill-receivement/bill-receivement-list/bill-receivement-list';
import { BillReceivementForm } from './pages/bill-receivement/bill-receivement-form/bill-receivement-form';

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
  ]},
  { path: 'cost-center', data: { title: 'Centro de Custo' }, children: [
    { path: '', component: CostCenterList, data: { title: null} },
    { path: ':id', component: CostCenterForm, resolve: { title: appTitleResolver }, data: { entityName: 'Centro de Custo' }}
  ]},
  { path: 'contact', data: { title: 'Contatos' }, children: [
    { path: '', component: ContactList, data: { title: null} },
    { path: ':id', component: ContactForm, resolve: { title: appTitleResolver }, data: { entityName: 'Contatos' }}
  ]},
  { path: 'bank', data: { title: 'Bancos' }, children: [
    { path: '', component: BankList, data: { title: null} },
    { path: ':id', component: BankForm, resolve: { title: appTitleResolver }, data: { entityName: 'Bancos' }}
  ]},
  { path: 'bill-receivement', data: { title: 'Contas a Receber' }, children: [
    { path: '', component: BillReceivementList, data: { title: null} },
    { path: ':id', component: BillReceivementForm, resolve: { title: appTitleResolver }, data: { entityName: 'Contas a Receber' }}
  ]},
];

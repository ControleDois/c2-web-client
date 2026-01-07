import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchLoadingUniqueInterface } from '../../../../../core/interfaces/search-loading-unique.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../../core/services/toast.service';
import { BillReceivementService } from '../../../../../core/services/bill-receivement.service';
import { catchError, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchLoadingUnique } from '../../../../../shared/components/search-loading-unique/search-loading-unique';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-bill-receivement-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, SearchLoadingUnique, NgxCurrencyDirective],
  templateUrl: './bill-receivement-form.html',
})
export class BillReceivementForm {
  private formId: string;

  activeTab: string = 'dados';

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(0),
    category_id: new FormControl('', Validators.required),
    bank_account_id: new FormControl('', Validators.required),
    people_id: new FormControl(''),
    cost_center_id: new FormControl(''),
    role: new FormControl(1),
    name: new FormControl('', Validators.required),
    date_competence: new FormControl('', Validators.required),
    date_due: new FormControl('', Validators.required),
    amount: new FormControl(0, Validators.required),
    repeat: new FormControl(false, Validators.required),
    repeat_period: new FormControl(0, Validators.required),
    repeat_occurrences: new FormControl(''),
    date_received: new FormControl(''),
    discount: new FormControl(0),
    fees: new FormControl(0),
    bill_value: new FormControl(0),
    form_payment: new FormControl(9),
    note: new FormControl(''),
    status: new FormControl(0),
  });

  public repeatPeriods = [
    { name: '⦿ Diariamente', type: 0 },
    { name: '⦿ Semanalmente', type: 1 },
    { name: '⦿ Mensalmente', type: 2 },
    { name: '⦿ Bimestralmente', type: 3 },
    { name: '⦿ Trimestralmente', type: 4 },
    { name: '⦿ Semestralmente', type: 5 },
    { name: '⦿ Anualmente', type: 6 },
  ];

  public formPaymentList = [
    { name: '⦿ Boleto Bancário', type: 0 },
    { name: '⦿ Cartão de Crédito', type: 1 },
    { name: '⦿ Cartão de Débito', type: 2 },
    { name: '⦿ Carteira Digital', type: 3 },
    { name: '⦿ Cashback', type: 4 },
    { name: '⦿ Cheque', type: 5 },
    { name: '⦿ Credito da Loja', type: 6 },
    { name: '⦿ Crédito Virtual', type: 7 },
    { name: '⦿ Depósito Bancário', type: 8 },
    { name: '⦿ Dinheiro', type: 9 },
    { name: '⦿ PIX - Pagamento Instantâneo', type: 10 },
    { name: '⦿ Programa de Fidelidade', type: 11 },
    { name: '⦿ Transferência Bancária', type: 12 },
    { name: '⦿ Vale Alimentação', type: 13 },
    { name: '⦿ Vale Combustível', type: 14 },
    { name: '⦿ Vale Presente', type: 15 },
    { name: '⦿ Vale Refeição', type: 16 },
  ];

  public validationFields: Array<any> = [
    {name: 'people_id', validation: true, msg: 'Informe um fornecedor!'},
    {name: 'category_id', validation: true, msg: 'Informe uma categoria!'},
    {name: 'bank_account_id', validation: true, msg: 'Informe uma conta bancaria!'},
  ];

  @Output() searchCategory: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Categoria',
    url: 'category',
    searchFieldOn: null,
    searchFieldOnCollum: ['name'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: [
      {
        param: 'role',
        value: 1
      }
    ]
  };

  @Output() searchBank: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Conta',
    url: 'bank',
    searchFieldOn: null,
    searchFieldOnCollum: ['name'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: []
  };

  @Output() searchPeople: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Cliente',
    url: 'people',
    searchFieldOn: null,
    searchFieldOnCollum: ['name', 'document', 'phone'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: [
      {
        param: 'roles',
        value: '{2}'
      }
    ]
  };

  @Output() searchCost: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Centro de custo',
    url: 'cost-center',
    searchFieldOn: null,
    searchFieldOnCollum: ['name'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: []
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private toast: ToastService,
    private billReceivementService: BillReceivementService,
    private router: Router,
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.billReceivementService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Conta não encontrada', 'Não foi possível encontrar a conta.');
          this.router.navigate(['bill-receivement']);
          return [];
        }),
        map((res) => {
          this.setForm(res);
        })
      ).subscribe();
    }
  }

  setForm(value: any): void {
    if (value) {
      this.searchCategory.searchFieldOn = value?.category;
      this.searchCategory.searchField.setValue(value?.category?.name);
      this.searchBank.searchFieldOn = value?.bank;
      this.searchBank.searchField.setValue(value?.bank?.name);
      this.searchPeople.searchFieldOn = value?.people;
      this.searchPeople.searchField.setValue(value?.people?.name);
      this.searchCost.searchFieldOn = value?.cost;
      this.searchCost.searchField.setValue(value?.cost?.name);
      this.myForm.patchValue(value);

      if (value.date_competence){
        const dateCompetence = value.date_competence.toString().split('T')[0];
        this.myForm.controls['date_competence'].setValue(dateCompetence);
      }
      if (value.date_due){
        const dateDue = value.date_due.toString().split('T')[0];
        this.myForm.controls['date_due'].setValue(dateDue);
      }
      if (value.date_received){
        const dateReceived = value.date_received.toString().split('T')[0];
        this.myForm.controls['date_received'].setValue(dateReceived);
      }

      this.myForm.value.status = this.myForm.value.status === 1 || false;
    }
  }

  validateForm(): void {
    this.searchPeople.validation = !!this.myForm.value.people_id;
    this.validationFields.find(v => v.name === 'people_id').validation = !!this.myForm.value.people_id;

    this.searchCategory.validation = !!this.myForm.value.category_id;
    this.validationFields.find(v => v.name === 'category_id').validation = !!this.myForm.value.category_id;

    this.searchBank.validation = !!this.myForm.value.bank_account_id;
    this.validationFields.find(v => v.name === 'bank_account_id').validation = !!this.myForm.value.bank_account_id;
  }

  save(): void {

    console.log(this.myForm.value)
    this.validateForm();

    if (this.myForm.valid) {
      this.billReceivementService.save(this.formId, this.myForm.value).subscribe({
        next: () => {
          this.toast.success('Sucesso!', this.formId == 'new' ? 'Cadastrado com sucesso' : 'Atualizado com sucesso');
          this.router.navigate(['bill-receivement']);
        },
        error: (res) => {
          let title = 'Atenção';
          let message = 'Ocorreu um erro ao realizar o cadastro, tente novamente mais tarde.';

          this.toast.error(title, message);
        }
      })
    } else {
      this.toast.warning('Campos inválidos', 'Existem campos a serem preenchidos corretamente.')
    }
  }

  sumValues(): void {
    if (this.myForm.value.status) {
      const amount = parseFloat(this.myForm.value.amount) || 0;
      const discount = parseFloat(this.myForm.value.discount) || 0;
      const fees = parseFloat(this.myForm.value.fees) || 0;

      const netTotal = (amount - discount) + fees;

      this.myForm.controls['bill_value'].setValue(netTotal);
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  nextTab() {
    const tabs = ['dados', 'cliente', 'pagamento'];
    const i = tabs.indexOf(this.activeTab);
    if (i < tabs.length - 1) this.activeTab = tabs[i + 1];
  }

  prevTab() {
    const tabs = ['dados', 'cliente', 'pagamento'];
    const i = tabs.indexOf(this.activeTab);
    if (i > 0) this.activeTab = tabs[i - 1];
  }

  selectItem(item: any, name: string) {
    if (item) {
      this.myForm.patchValue({
        [name]: item.id
      });

    } else {
      this.myForm.patchValue({
        [name]: null
      });
    }
  }
}

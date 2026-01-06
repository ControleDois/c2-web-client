import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxCurrencyDirective } from 'ngx-currency';
import { BankService } from '../../../../../core/services/bank.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { catchError, map } from 'rxjs';

@Component({
  selector: 'app-bank-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgxCurrencyDirective],
  templateUrl: './bank-form.html',
})
export class BankForm {
  private formId: string;

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(0),
    name: new FormControl('', Validators.required),
    balance: new FormControl(0, Validators.required),
    date_balance: new FormControl(new Date().toString().split('T')[0])
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private bankService: BankService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.bankService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Banco não encontrado', 'Não foi possível encontrar o banco.');
          this.router.navigate(['service']);
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
      this.myForm.patchValue(value);

      if (value.date_balance) {
        const dateBalance = value.date_balance.toString().split('T')[0];
        this.myForm.controls['date_balance'].setValue(dateBalance);
      }
    }
  }

  public validationFields: Array<any> = [
    { name: 'name', validation: true, msg: 'É necessário informar o nome' },
  ];

  validateForm(): void {
    this.validationFields.find((v) => v.name === 'name').validation = !!this.myForm.value.name;
  }

  save(): void {
    this.validateForm();

    if (this.myForm.valid) {
      this.bankService.save(this.formId, this.myForm.value).subscribe({
        next: () => {
          this.toast.success('Sucesso!', this.formId == 'new' ? 'Cadastrado com sucesso' : 'Atualizado com sucesso');
          this.router.navigate(['service']);
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
}

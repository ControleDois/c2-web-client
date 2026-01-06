import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceService } from '../../../../../core/services/service.service';
import { catchError, map } from 'rxjs';
import { ToastService } from '../../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-service-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgxCurrencyDirective],
  templateUrl: './service-form.html',
  styleUrl: './service-form.css',
})
export class ServiceForm {
  private formId: string;
  public activeTab: string = 'dados';

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(0),
    role: new FormControl(1, Validators.required),
    name: new FormControl('', Validators.required),
    sale_value: new FormControl(''),
  });

  public kinds = [
    { name: '⦿ Prestado', type: 0 },
    { name: '⦿ Tomado', type: 1 },
    { name: '⦿ Prestado e Tomado', type: 2 }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceService: ServiceService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.serviceService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Serviço não encontrado', 'Não foi possível encontrar o serviço.');
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
      this.serviceService.save(this.formId, this.myForm.value).subscribe({
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

  setTab(tab: string) {
    this.activeTab = tab;
  }

  nextTab() {
    const tabs = ['dados'];
    const i = tabs.indexOf(this.activeTab);
    if (i < tabs.length - 1) this.activeTab = tabs[i + 1];
  }

  prevTab() {
    const tabs = ['dados'];
    const i = tabs.indexOf(this.activeTab);
    if (i > 0) this.activeTab = tabs[i - 1];
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CostCenterService } from '../../../../../core/services/cost-center.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { catchError, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cost-center-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cost-center-form.html',
})
export class CostCenterForm {
  private formId: string;

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(''),
    name: new FormControl('', Validators.required),
  });

  public validationFields: Array<any> = [
    { name: 'name', validation: true, msg: 'É necessário informar o nome'},
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private costCenterService: CostCenterService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.costCenterService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Centro de custo não encontrado', 'Não foi possível encontrar o centro de custo.');
          this.router.navigate(['cost-center']);
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

  validateForm(): void {
    this.validationFields.find((v) => v.name === 'name').validation = !!this.myForm.value.name;
  }

  save(): void {
    this.validateForm();

    if (this.myForm.valid) {
      this.costCenterService.save(this.formId, this.myForm.value).subscribe({
        next: () => {
          this.toast.success('Sucesso!', this.formId == 'new' ? 'Cadastrado com sucesso' : 'Atualizado com sucesso');
          this.router.navigate(['cost-center']);
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../../../../core/services/contact.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { catchError, map } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './contact-form.html',
})
export class ContactForm {
  private formId: string;

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(0),
    name: new FormControl('', Validators.required),
    email: new FormControl(''),
    phone: new FormControl('', Validators.required),
    birth: new FormControl(''),
    observation: new FormControl(''),
    is_group: new FormControl(false),
  });

  public validationFields: Array<any> = [
    { name: 'name', validation: true, msg: 'É necessário informar o nome'},
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.contactService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Contato não encontrado', 'Não foi possível encontrar o contato.');
          this.router.navigate(['contact']);
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
      if (value.birth) {
        const dateBirth = value.birth.toString().split('T')[0];
        this.myForm.controls['birth'].setValue(dateBirth);
      }
    }
  }

  validateForm(): void {
    this.validationFields.find((v) => v.name === 'name').validation = !!this.myForm.value.name;
  }

  save(): void {
    this.validateForm();

    if (this.myForm.valid) {
      this.contactService.save(this.formId, this.myForm.value).subscribe({
        next: () => {
          this.toast.success('Sucesso!', this.formId == 'new' ? 'Cadastrado com sucesso' : 'Atualizado com sucesso');
          this.router.navigate(['contact']);
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

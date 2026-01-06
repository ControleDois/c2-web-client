import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchLoadingUniqueInterface } from '../../../../../core/interfaces/search-loading-unique.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { catchError, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchLoadingUnique } from '../../../../../shared/components/search-loading-unique/search-loading-unique';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, SearchLoadingUnique],
  templateUrl: './category-form.html',
})
export class CategoryForm {
  private formId: string;

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(''),
    category_id: new FormControl(''),
    role: new FormControl(0, Validators.required),
    name: new FormControl('', Validators.required),
  });

  public roles = [
    { name: '⦿ Despesa', type: 0 },
    { name: '⦿ Receita', type: 1 }
  ];

  @Output() searchCategory: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Aparecer dentro de',
    url: 'category',
    searchFieldOn: null,
    searchFieldOnCollum: ['name', 'code'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    paramsArray: [
      {
        param: 'role',
        value: 0
      }
    ],
    validation: true
  };

  public validationFields: Array<any> = [
    { name: 'name', validation: true, msg: 'É necessário informar o nome'},
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.categoryService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Categoria não encontrada', 'Não foi possível encontrar a categoria.');
          this.router.navigate(['category']);
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
      this.categoryService.save(this.formId, this.myForm.value).subscribe({
        next: () => {
          this.toast.success('Sucesso!', this.formId == 'new' ? 'Cadastrado com sucesso' : 'Atualizado com sucesso');
          this.router.navigate(['category']);
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

  selectCategory(item: any) {
    if (item) {
      this.myForm.patchValue({
        category_id: item.id
      });

    } else {
      this.myForm.patchValue({
        category_id: null
      });
    }
  }

  getRole(): void {
    this.searchCategory.searchFieldOn = null;
    this.searchCategory.searchField.setValue('');
    this.searchCategory.paramsArray = [
      {
        param: 'role',
        value: this.myForm.value.role
      }
    ];
  }
}

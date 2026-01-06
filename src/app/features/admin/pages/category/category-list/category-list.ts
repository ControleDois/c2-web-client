import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../../core/services/category.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, throwError } from 'rxjs';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ConfirmModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-list.html',
})
export class CategoryList {
  protected Math = Math;
  public list: any[] = [];
  meta: MetaData | null = null;
  isLoading = true;

  // Controle do Modal
  isModalOpen = false;
  modalConfig = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancelar',
    type: 'danger' as 'danger' | 'info' | 'success',
    action: () => {}
  };

  public searchTerm = new FormControl('');

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(() => {
          this.loadData(1);
          this.cdr.detectChanges();
        })
      )
      .subscribe();

    this.loadData(1);
  }

  loadData(page: number) {
    this.isLoading = true;

    this.categoryService.index(this.searchTerm.value ? this.searchTerm.value : '',
      'name', 'name', page.toString(),'10', true).pipe(
        map(res => {
          this.list = res.data;
          this.meta = res.meta;
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      ).subscribe();
  }

  nextPage() {
    if (this.meta && this.meta.current_page < this.meta.last_page) {
      this.loadData(this.meta.current_page + 1);
    }
  }

  prevPage() {
    if (this.meta && this.meta.current_page > 1) {
      this.loadData(this.meta.current_page - 1);
    }
  }

  openDeleteModal(item: any) {
    this.modalConfig = {
      title: 'Excluir Categoria',
      message: `Tem certeza que deseja excluir ${item.name}? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      action: () => {
        this.isLoading = true;
        this.categoryService.destroy(item.id).pipe(
          finalize(() => this.isLoading = false),
          catchError((error) => {
            return throwError(error);
          }),
          map(() => {
            this.loadData(1);
            this.cdr.detectChanges;
          })
        ).subscribe();
      }
    };
    this.isModalOpen = true;
  }

  onModalConfirm() {
    this.modalConfig.action();
    this.isModalOpen = false;
  }
}

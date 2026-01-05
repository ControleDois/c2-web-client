import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Product } from '../../../../../core/interfaces/product.interface';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { ProductService } from '../../../../../core/services/product.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ConfirmModal, NgxCurrencyDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  protected Math = Math;
  products: Product[] = [];
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
    private productService: ProductService,
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

    this.productService.index(this.searchTerm.value ? this.searchTerm.value : '',
      'name', 'name', page.toString(),'10', false, true).pipe(
        map(res => {
          this.products = res.data;
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

  openDeleteModal(person: any) {
    this.modalConfig = {
      title: 'Excluir Produto',
      message: `Tem certeza que deseja excluir ${person.name}? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      action: () => {
        this.isLoading = true;
        this.productService.destroy(person.id).pipe(
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
    this.modalConfig.action(); // Executa a função guardada
    this.isModalOpen = false;  // Fecha
  }
}

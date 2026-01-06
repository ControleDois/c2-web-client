import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { BankService } from '../../../../../core/services/bank.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, throwError } from 'rxjs';

@Component({
  selector: 'app-bank-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ConfirmModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bank-list.html',
})
export class BankList {
  protected Math = Math;
  list: any[] = [];
  meta: MetaData | null = null;
  isLoading = true;

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
    private bankService: BankService,
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

    this.bankService.index(this.searchTerm.value ? this.searchTerm.value : '',
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

  openDeleteModal(person: any) {
    this.modalConfig = {
      title: 'Excluir Banco',
      message: `Tem certeza que deseja excluir ${person.name}? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      action: () => {
        this.isLoading = true;
        this.bankService.destroy(person.id).pipe(
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

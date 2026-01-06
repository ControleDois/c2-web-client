import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../../../../core/services/service.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ConfirmModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './service-list.html',
})
export class ServiceList {
  protected Math = Math;
  list: any[] = [];
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
    private serviceService: ServiceService,
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

    this.serviceService.index(this.searchTerm.value ? this.searchTerm.value : '',
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
      title: 'Excluir Serviço',
      message: `Tem certeza que deseja excluir ${person.name}? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      action: () => {
        this.isLoading = true;
        this.serviceService.destroy(person.id).pipe(
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

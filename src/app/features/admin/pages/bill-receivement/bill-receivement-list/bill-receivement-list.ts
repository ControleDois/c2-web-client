import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { BillReceivementService } from '../../../../../core/services/bill-receivement.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, throwError } from 'rxjs';

@Component({
  selector: 'app-bill-receivement-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ConfirmModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bill-receivement-list.html',
})
export class BillReceivementList {
  protected Math = Math;
  public list: any[] = [];
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
  public startDate = new FormControl(new Date());
  public endDate = new FormControl(new Date());

  public showFilters = false;
  public selectedFilter: string = 'total';

  public financialSummary = {
    late: { count: 0, value: 0 },         // Em atraso (Vermelho)
    receivable: { count: 0, value: 0 },   // A receber (Azul)
    received: { count: 10, value: 1319.34 }, // Recebido (Verde)
    total: { count: 10, value: 1319.34 }     // Total (Cinza/Preto)
  };

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
    { name: '⦿ PIX', type: 10 },
    { name: '⦿ Programa de Fidelidade', type: 11 },
    { name: '⦿ Transferência Bancária', type: 12 },
    { name: '⦿ Vale Alimentação', type: 13 },
    { name: '⦿ Vale Combustível', type: 14 },
    { name: '⦿ Vale Presente', type: 15 },
    { name: '⦿ Vale Refeição', type: 16 },
  ];

  public selectedIds: Set<number> = new Set<number>();

  constructor(
    private billReceivementService: BillReceivementService,
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

    this.billReceivementService.index(this.searchTerm.value ? this.searchTerm.value : '',
      this.startDate.value ? this.startDate.value.toISOString().split('T')[0] : '',
       'date_sale', 'date_sale',
      page.toString(), '10', true).pipe(
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
      title: 'Excluir Contas a Receber',
      message: `Tem certeza que deseja excluir ${item.name}? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      action: () => {
        this.isLoading = true;
        this.billReceivementService.destroy(item.id).pipe(
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

  clearFilters() {
    this.startDate.setValue(new Date());
    this.endDate.setValue(new Date());
    this.loadData(1);
  }

  applyFilters() {
    this.loadData(1);
  }

  setFilter(status: string) {
    this.selectedFilter = status;
    this.loadData(1);
  }

  // Total selecionado (Soma dos valores dos itens marcados)
  get selectedTotalValue(): number {
    return this.list
      .filter(item => this.selectedIds.has(item.id))
      .reduce((acc, item) => acc + (item.value || 0), 0); // Supondo que item tenha .value
  }

  // Lógica de Checkbox Individual
  toggleSelection(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  // Lógica de Selecionar Todos (Da página atual)
  toggleAll(event: any) {
    if (event.target.checked) {
      this.list.forEach(item => this.selectedIds.add(item.id));
    } else {
      this.list.forEach(item => this.selectedIds.delete(item.id));
    }
  }

  // Verifica se todos da página estão marcados (para o checkbox do cabeçalho)
  isAllSelected(): boolean {
    return this.list.length > 0 && this.list.every(item => this.selectedIds.has(item.id));
  }
}

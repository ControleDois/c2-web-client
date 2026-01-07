import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { BillReceivementService } from '../../../../../core/services/bill-receivement.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, throwError } from 'rxjs';

export interface PaymentMethod {
  name: string;
  type: number;
  styles: string;
  icon: string;
}

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
  itemsPerPage = 10;
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

  public formPaymentList: PaymentMethod[] = [
    {
      name: 'Boleto Bancário',
      type: 0,
      styles: 'bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20',
      icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' // Barcode/Boleto visual
    },
    {
      name: 'Cartão de Crédito',
      type: 1,
      styles: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30',
      icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'
    },
    {
      name: 'Cartão de Débito',
      type: 2,
      styles: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30',
      icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'
    },
    {
      name: 'Carteira Digital',
      type: 3,
      styles: 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30',
      icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
    },
    {
      name: 'Cashback',
      type: 4,
      styles: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
      icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
    },
    {
      name: 'Cheque',
      type: 5,
      styles: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20',
      icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
    },
    {
      name: 'Crédito da Loja',
      type: 6,
      styles: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20',
      icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z'
    },
    {
      name: 'Crédito Virtual',
      type: 7,
      styles: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20',
      icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10.5 7.5v6m3-3h-6'
    },
    {
      name: 'Depósito Bancário',
      type: 8,
      styles: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20 dark:bg-cyan-400/10 dark:text-cyan-400 dark:ring-cyan-400/20',
      icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z'
    },
    {
      name: 'Dinheiro',
      type: 9,
      styles: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
      icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      name: 'PIX',
      type: 10,
      styles: 'bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-400/10 dark:text-teal-400 dark:ring-teal-400/20',
      // Ícone similar a um losango/pix
      icon: 'M5.25 14.25h13.5l-6.75 6.75-6.75-6.75zM5.25 9.75h13.5L12 3 5.25 9.75z'
    },
    {
      name: 'Programa Fidelidade',
      type: 11,
      styles: 'bg-pink-50 text-pink-700 ring-pink-600/20 dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/20',
      icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
    },
    {
      name: 'Transferência Bancária',
      type: 12,
      styles: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20 dark:bg-cyan-400/10 dark:text-cyan-400 dark:ring-cyan-400/20',
      icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'
    },
    {
      name: 'Vale Alimentação',
      type: 13,
      styles: 'bg-lime-50 text-lime-700 ring-lime-600/20 dark:bg-lime-400/10 dark:text-lime-400 dark:ring-lime-400/20',
      icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'
    },
    {
      name: 'Vale Combustível',
      type: 14,
      styles: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20',
      icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z'
    },
    {
      name: 'Vale Presente',
      type: 15,
      styles: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20',
      icon: 'M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M16.5 7.5V5.625a3.375 3.375 0 10-6.75 0V7.5m0 0v3.75m0-3.75h6m-6 3.75h6m6-3.75v3.75m-3-3.75h-6.75'
    },
    {
      name: 'Vale Refeição',
      type: 16,
      styles: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20',
      icon: 'M2.61 3.738C5.698 1.94 9.626 2 12 2s6.302-.06 9.39 1.738c1.33.774 2.215 2.138 2.302 3.676a3.751 3.751 0 01-2.905 3.896l-.805 4.305a4.5 4.5 0 01-4.426 3.674H8.444a4.5 4.5 0 01-4.426-3.674l-.805-4.305a3.751 3.751 0 01-2.905-3.896c.087-1.538.972-2.902 2.302-3.676z'
    },
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
      page.toString(), this.itemsPerPage.toString(), true).pipe(
      map(res => {
        this.list = res.data;
        this.meta = res.meta;
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe();
  }

  updateItemsPerPage(event: any) {
    this.itemsPerPage = Number(event.target.value);
    this.loadData(1);
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
      .reduce((acc, item) => acc + (item.amount || 0), 0);
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

  getTotalAmountDateDueQtd(): number {
    return this.list.length > 0 ? this.list.filter(t => t.status === 0 && new Date(t.date_due) < new Date())
      .reduce((acc, t) => acc + 1, 0) : 0;
  }

  getTotalAmountDateDue(): string {
    const total = this.list.length > 0 ? this.list.filter(t => t.status === 0 && new Date(t.date_due) < new Date())
      .reduce((acc, t) => (parseFloat(acc) || 0) + (parseFloat(t.amount) || 0), 0) : 0;
    return total > 0 ? parseFloat(total).toFixed(2) : '0.00';
  }

  getTotalAmountQtd(): number {
    return this.list.length > 0 ? this.list.filter(t => t.status === 0)
      .reduce((acc, t) => acc + 1, 0) : 0;
  }

  getTotalAmount(): string {
    const total = this.list.length > 0 ? this.list.filter(t => t.status === 0)
      .reduce((acc, t) => (parseFloat(acc) || 0) + (parseFloat(t.amount) || 0), 0) : 0;
    return total > 0 ? parseFloat(total).toFixed(2) : '0.00';
  }

  getTotalBillValue(): string {
    const total = this.list.length > 0 ? this.list.filter(t => t.status === 1)
      .reduce((acc, t) => (parseFloat(acc) || 0) + (parseFloat(t.bill_value) || 0), 0) : 0;
    return total > 0 ? parseFloat(total).toFixed(2) : '0.00';
  }

  getTotalBillValueQtd(): number {
    return this.list.length > 0 ? this.list.filter(t => t.status === 1)
      .reduce((acc, t) => acc + 1, 0) : 0;
  }

  getTotalBill(): string {
    return this.list.length > 0 ? this.list.filter(t => t)
      .reduce((acc, t) => acc + 1, 0) : '0';
  }

  getTotal(): string {
    const total = this.list.length > 0 ? this.list.filter(t => t)
      .reduce((acc, t) => (parseFloat(acc) || 0) + (t.status === 0 ? parseFloat(t.amount) : parseFloat(t.bill_value) || 0), 0) : 0;
    return total > 0 ? parseFloat(total).toFixed(2) : '0.00';
  }
}

import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PeopleService } from '../../../../../core/services/people.service';
import { People } from '../../../../../core/interfaces/people.interface';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from '../../../../../shared/pipes/cpf-cnpj.pipe';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-people-list',
  imports: [CommonModule, CpfCnpjPipe, FormsModule, ReactiveFormsModule, RouterModule, ConfirmModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './people-list.html',
  styleUrl: './people-list.css',
})
export class PeopleList {

  protected Math = Math;
  people: People[] = [];
  meta: MetaData | null = null;
  isLoading = true;

  // Controle do Menu de Filtros
  showFilterMenu = false;

  // Opções do Filtro
  filterOptions = [
    { id: '0', label: 'Usuário', checked: false },
    { id: '1', label: 'Empresa', checked: false },
    { id: '2', label: 'Cliente', checked: false },
    { id: '3', label: 'Fornecedor', checked: false },
    { id: '4', label: 'Transportadora', checked: false },
  ];

  // Variável da busca
  public searchTerm = new FormControl('');

  // Configuração dos papéis (ID -> Texto e Cores)
  roleConfigs: any = {
    0: { label: 'Usuário',      css: 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20' },
    1: { label: 'Empresa',      css: 'bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20' },
    2: { label: 'Cliente',      css: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20' },
    3: { label: 'Fornecedor',   css: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20' },
    4: { label: 'Transportador',css: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20' }
  };

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

  constructor(
    private peopleService: PeopleService,
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

    let paramRoles = {param: 'roles', value: `{${this.filterOptions.filter(option => option.checked).map(option => option.id)}}`};

    this.peopleService.index(this.searchTerm.value ? this.searchTerm.value : '',
      'name', 'name', page.toString(),'10', [paramRoles], true).pipe(
        map(res => {
          this.people = res.data;
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

  // Função para fechar o menu se clicar fora (Opcional, mas recomendado)
  toggleFilter() {
    this.showFilterMenu = !this.showFilterMenu;
  }

  // Função auxiliar para evitar erros se vier um ID desconhecido
  getRoleData(roleId: number) {
    return this.roleConfigs[roleId] || { label: 'Desconhecido', css: 'bg-gray-50 text-gray-600 ring-gray-500/10' };
  }

  onFilterChange() {
    // Volta para a página 1 sempre que mudar o filtro
    this.loadData(1);
  }

  openDeleteModal(person: any) {
    this.modalConfig = {
      title: 'Excluir Pessoa',
      message: `Tem certeza que deseja excluir ${person.name}? Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      action: () => {
        this.isLoading = true;
        this.peopleService.destroy(person.id).pipe(
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

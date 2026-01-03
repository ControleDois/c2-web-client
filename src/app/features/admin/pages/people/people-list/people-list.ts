import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PeopleService } from '../../../../../core/services/people.service';
import { People } from '../../../../../core/interfaces/people.interface';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from '../../../../../shared/pipes/cpf-cnpj.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-people-list',
  imports: [CommonModule, CpfCnpjPipe, FormsModule],
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
    { id: 'usuario', label: 'Usuário', checked: false },
    { id: 'empresa', label: 'Empresa', checked: false },
    { id: 'cliente', label: 'Cliente', checked: true }, // Exemplo: padrão marcado
    { id: 'fornecedor', label: 'Fornecedor', checked: false },
    { id: 'transportadora', label: 'Transportadora', checked: false },
  ];

  // Variável da busca
  searchTerm = '';

  // Configuração dos papéis (ID -> Texto e Cores)
  roleConfigs: any = {
    0: { label: 'Usuário',      css: 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20' },
    1: { label: 'Empresa',      css: 'bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20' },
    2: { label: 'Cliente',      css: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20' },
    3: { label: 'Fornecedor',   css: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20' },
    4: { label: 'Transportador',css: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20' }
  };

  constructor(
    private peopleService: PeopleService,
    private cdr: ChangeDetectorRef,
  ) {
  }


  ngOnInit() {
    this.loadData(1);
  }

  loadData(page: number) {
    this.isLoading = true;

    this.peopleService.index('',
      'name', 'name', page.toString(),'10', [], true).pipe(
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
}

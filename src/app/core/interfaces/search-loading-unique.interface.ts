// search-loading-unique.interface.ts
import { FormControl } from '@angular/forms';

export interface SearchLoadingUniqueInterface {
  noTitle?: boolean;
  title: string;
  url: string; // Endpoint da API
  searchFieldOn?: any; // Objeto selecionado
  searchFieldOnCollum: string[]; // Colunas para exibir (ex: ['nome', 'sobrenome'])
  sortedBy?: string;
  orderBy?: string;
  paramsArray?: any[];
  searchField: FormControl;
  validation?: boolean; // Para borda vermelha de erro
  change?: () => void; // Callback ao selecionar
}

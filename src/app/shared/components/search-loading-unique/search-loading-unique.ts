import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { SearchLoadingUniqueInterface } from '../../../core/interfaces/search-loading-unique.interface';
import { SearchLoadingUniqueService } from '../../../core/services/search-loading-unique.service';
import { debounceTime, distinctUntilChanged, filter, finalize, map, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-loading-unique',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-loading-unique.html',
  styleUrl: './search-loading-unique.css',
})
export class SearchLoadingUnique {
  @Input() public search!: SearchLoadingUniqueInterface;
  @Output() public eventEmit = new EventEmitter<any>();

  public list: any[] = [];
  public loading = false;
  public showDropdown = false;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private searchLoadingUniqueService: SearchLoadingUniqueService,
    private eRef: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {}

  // Fecha o dropdown se clicar fora do componente
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  ngOnInit(): void {
    // Inicializa valor se já vier preenchido
    if (this.search.searchFieldOn) {
      const display = this.getDisplayValue(this.search.searchFieldOn);
      this.search.searchField.setValue(display, { emitEvent: false });
    }

    this.search.searchField.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        // Só busca se o usuário digitou algo e NÃO temos um item selecionado travado
        filter(val => typeof val === 'string'),
        tap(() => {
           if (!this.search.searchFieldOn) {
             this.load();
           }
        })
      )
      .subscribe();
  }

  load(): void {
    this.loading = true;
    this.showDropdown = true; // Abre o dropdown ao carregar

    const term = typeof this.search.searchField.value === 'string' ? this.search.searchField.value : '';

    this.searchLoadingUniqueService.index(
      this.search.url,
      term,
      this.search.sortedBy || 'name',
      this.search.orderBy || 'asc',
      1,
      10,
      this.search.paramsArray || []
    )
      .pipe(
        map((res: any) => {
          this.list = res.data || [];
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges()
        })
      )
      .subscribe();
  }

  // Ao focar no input, se estiver vazio ou não selecionado, sugere dados
  onFocus() {
    if (!this.search.searchFieldOn) {
      this.load();
    }
  }

  selectItem(item: any): void {
    this.search.searchFieldOn = item;

    // Define o texto no input
    const displayValue = this.getDisplayValue(item);
    this.search.searchField.setValue(displayValue, { emitEvent: false });

    this.showDropdown = false;
    this.eventEmit.emit(item);

    if (this.search.change) {
      this.search.change();
    }
  }

  removeItem(): void {
    this.search.searchFieldOn = null;
    this.search.searchField.setValue('');
    this.list = [];
    this.showDropdown = false;

    // Foca de volta no input para facilitar nova busca
    setTimeout(() => this.searchInput.nativeElement.focus(), 100);
    this.eventEmit.emit(null);
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  getDisplayValue(item: any): string {
    if (!item) return '';
    return this.search.searchFieldOnCollum
      .map(field => item[field] || '')
      .filter(value => !!value)
      .join(' - ');
  }

  getItemTitle(item: any): string {
    if (!item || this.search.searchFieldOnCollum.length === 0) return '';
    // Pega o nome da primeira coluna definida no array
    const mainField = this.search.searchFieldOnCollum[0];
    // Retorna o valor do item nessa coluna
    return item[mainField] || 'Sem título';
  }

  getItemSubtitles(item: any): string[] {
    if (!item || this.search.searchFieldOnCollum.length <= 1) return [];

    // Pega todas as colunas do array, exceto a primeira (slice(1))
    const subtitleFields = this.search.searchFieldOnCollum.slice(1);

    // Mapeia para os valores e remove os vazios
    return subtitleFields
      .map(field => item[field] || '')
      .filter(val => !!val && val.toString().trim() !== '');
  }
}

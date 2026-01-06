import { Component, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchLoadingUniqueInterface } from '../../../../../core/interfaces/search-loading-unique.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../../core/services/product.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { catchError, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchLoadingUnique } from '../../../../../shared/components/search-loading-unique/search-loading-unique';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, SearchLoadingUnique, NgxCurrencyDirective],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private formId: string;

  activeTab: string = 'dados';

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(0),
    ncm_id: new FormControl('', Validators.required),
    nfe_taxation_id: new FormControl('', Validators.required),
    brand_id: new FormControl(''),
    role: new FormControl(0, Validators.required),
    name: new FormControl('', Validators.required),
    sale_value: new FormControl('', Validators.required),
    description: new FormControl(''),
    barcode: new FormControl(''),
    unit: new FormControl(''),
    icms_origin: new FormControl(0),
    gross_weighy: new FormControl(''),
    fuel_anp: new FormControl(''),
    code_cest: new FormControl(''),
    cfop_state: new FormControl(''),
    cfop_interstate: new FormControl(''),
    img_path: new FormControl(''),
    img_url: new FormControl(''),
    heavy_product: new FormControl(0),
    change_price: new FormControl(false),
    shop: new FormGroup({
      name: new FormControl(''),
      sale_value: new FormControl(0),
      description: new FormControl(''),
      active_minimum_sales_quantity: new FormControl(false),
      minimum_sales_quantity: new FormControl(1),
      active: new FormControl(false),
    }),
    categories: new FormArray([]),
    complements: new FormArray([]),
  });

  public listIcmsOrigem = [
    { name: '0 - Nacional', type: 0 },
    { name: '1 - Estrangeira (importação direta)', type: 1 },
    { name: '2 - Estrangeira (adquirida no mercado interno)', type: 2 },
    { name: '3 - Nacional com mais de 40% de conteúdo estrangeiro', type: 3 },
    { name: '4 - Nacional produzida através de processos produtivos básicos', type: 4 },
    { name: '5 - Nacional com menos de 40% de conteúdo estrangeiro', type: 5 },
    { name: '6 - Estrangeira (importação direta) sem produto nacional similar', type: 6 },
    { name: '7 - Estrangeira (adquirida no mercado interno) sem produto nacional similar', type: 7 },
    { name: '8 - Nacional, mercadoria ou bem com conteúdo de importação superior a 70%', type: 8 },
  ];

  public listUnit = [
    { name: '⦿ CA - Caixa', type: 'CA' },
    { name: '⦿ CX - Caixa Grande', type: 'CX' },
    { name: '⦿ UN - Unidade', type: 'UN' },
    { name: '⦿ KG - Quilograma', type: 'KG' },
    { name: '⦿ LT - Litro', type: 'LT' },
    { name: '⦿ ML - Mililitro', type: 'ML' },
    { name: '⦿ MT - Metro', type: 'MT' },
    { name: '⦿ M2 - Metro Quadrado', type: 'M2' },
    { name: '⦿ M3 - Metro Cúbico', type: 'M3' },
    { name: '⦿ PC - Peça', type: 'PC' },
    { name: '⦿ PT - Pacote', type: 'PT' },
    { name: '⦿ CXA - Caixa com 10 unidades', type: 'CXA' },
    { name: '⦿ DZ - Dúzia', type: 'DZ' },
    { name: '⦿ GR - Grama', type: 'GR' },
    { name: '⦿ CM - Centímetro', type: 'CM' },
    { name: '⦿ MM - Milímetro', type: 'MM' },
    { name: '⦿ PAR - Par', type: 'PAR' },
    { name: '⦿ MIL - Milheiro', type: 'MIL' },
    { name: '⦿ TON - Tonelada', type: 'TON' },
    { name: '⦿ GAL - Galão', type: 'GAL' },
    { name: '⦿ BD - Barril', type: 'BD' },
    { name: '⦿ AM - Ampola', type: 'AM' },
    { name: '⦿ FR - Frasco', type: 'FR' },
    { name: '⦿ BL - Bloco', type: 'BL' },
    { name: '⦿ SC - Saco', type: 'SC' },
    { name: '⦿ RL - Rolo', type: 'RL' },
    { name: '⦿ FT - Fardo', type: 'FT' },
    { name: '⦿ CP - Copo', type: 'CP' },
    { name: '⦿ PF - Pacote Fechado', type: 'PF' },
    { name: '⦿ TM - Tambor', type: 'TM' },
    { name: '⦿ HB - Hábito (customizado)', type: 'HB' },
    { name: '⦿ CJ - Conjunto', type: 'CJ' },
    { name: '⦿ CD - Cento', type: 'CD' },
    { name: '⦿ TP - Tipo', type: 'TP' },
    { name: '⦿ TO - Toalha', type: 'TO' },
    { name: '⦿ ES - Estojo', type: 'ES' },
    { name: '⦿ PE - Pente', type: 'PE' },
  ];

  @Output() searchNCM: SearchLoadingUniqueInterface = {
    title: 'NCM',
    url: 'ncm',
    searchFieldOn: null,
    searchFieldOnCollum: ['code', 'description'],
    sortedBy: 'description',
    orderBy: 'description',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: [],
  };

  @Output() searchTaxation: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Grupo de Tributação',
    url: 'nfe-taxation',
    searchFieldOn: null,
    searchFieldOnCollum: ['name'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: [],
  };

  @Output() searchBrand: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Marca',
    url: 'brand',
    searchFieldOn: null,
    searchFieldOnCollum: ['name'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: [],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.productService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Produto não encontrado', 'Não foi possível encontrar o produto.');
          this.router.navigate(['product']);
          return [];
        }),
        map((res) => {
          this.setForm(res);
        })
      ).subscribe();
    }
  }

  setForm(value: any): void {
    if (value) {
      this.myForm.patchValue(value);

      this.searchTaxation.searchFieldOn = value.taxation;
      this.searchTaxation.searchField.setValue(value?.taxation?.name);

      this.searchNCM.searchFieldOn = value?.ncm;
      this.searchNCM.searchField.setValue(value?.ncm?.code);

      this.searchBrand.searchFieldOn = value?.brand;
      this.searchBrand.searchField.setValue(value?.brand?.name);
    }
  }

  public validationFields: Array<any> = [
    { name: 'name', validation: true, msg: 'É necessário informar o nome' },
  ];

  validateForm(): void {
    this.validationFields.find((v) => v.name === 'name').validation = !!this.myForm.value.name;
  }

  save(): void {
    this.validateForm();

    if (this.myForm.valid) {
      this.productService.save(this.formId, this.myForm.value).subscribe({
        next: () => {
          this.toast.success('Sucesso!', this.formId == 'new' ? 'Cadastrado com sucesso' : 'Atualizado com sucesso');
          this.router.navigate(['product']);
        },
        error: (res) => {
          let title = 'Atenção';
          let message = 'Ocorreu um erro ao realizar o cadastro, tente novamente mais tarde.';

          this.toast.error(title, message);
        }
      })
    } else {
      this.toast.warning('Campos inválidos', 'Existem campos a serem preenchidos corretamente.')
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  nextTab() {
    const tabs = ['dados'];
    const i = tabs.indexOf(this.activeTab);
    if (i < tabs.length - 1) this.activeTab = tabs[i + 1];
  }

  prevTab() {
    const tabs = ['dados'];
    const i = tabs.indexOf(this.activeTab);
    if (i > 0) this.activeTab = tabs[i - 1];
  }

  selectNCM(item: any) {
    if (item) {
      this.myForm.patchValue({
        ncm_id: item.id
      });

    } else {
      this.myForm.patchValue({
        ncm_id: null
      });
    }
  }

  selectTaxation(item: any) {
    if (item) {
      this.myForm.patchValue({
        nfe_taxation_id: item.id
      });

    } else {
      this.myForm.patchValue({
        nfe_taxation_id: null
      });
    }
  }
}

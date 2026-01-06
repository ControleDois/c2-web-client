import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeopleService } from '../../../../../core/services/people.service';
import { catchError, map } from 'rxjs';
import { ToastService } from '../../../../../core/services/toast.service';
import { NgxMaskDirective } from 'ngx-mask';
import { DropboxFile } from '../../../../../core/interfaces/dropbox.interface';
import { DropboxService } from '../../../../../core/services/dropbox.service';
import { SearchLoadingUnique } from '../../../../../shared/components/search-loading-unique/search-loading-unique';
import { SearchLoadingUniqueInterface } from '../../../../../core/interfaces/search-loading-unique.interface';

@Component({
  selector: 'app-people-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgxMaskDirective, SearchLoadingUnique],
  templateUrl: './people-form.html',
})
export class PeopleForm implements OnInit{
  private formId: string;

  // Controle de Abas
  activeTab: string = 'dados'; // 'dados' | 'fiscal' | 'endereco' | 'observacao'

  vehicles: any[] = [
    { brand: '', model: '', year: '', plate: '' }
  ];

  keys: any[] = [
    { type: 'CTrix ERP - Old', date: '2026-04-01', value: 'RVSSQS-1522-QURRPR-FJGG-16913-KXT3C5CZB5K35' },
    { type: 'CTrix ERP', date: '2026-02-02', value: '' } // Exemplo vazio
  ];

  remotes: any[] = [
    { type: 'RustDesk', name: 'Servidor', id: '70 562 041', password: 'senhadificil' }
  ];

  public myForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    company_id: new FormControl(''),
    name: new FormControl('', Validators.required),
    roles: new FormControl([2], Validators.required),
    people_type: new FormControl(0),
    social_name: new FormControl(''),
    simple: new FormControl(false),
    state_registration_indicator: new FormControl(0),
    state_registration: new FormControl(''),
    municipal_registration: new FormControl(''),
    inscription_suframa: new FormControl(''),
    document: new FormControl(''),
    general_record: new FormControl(''),
    birth: new FormControl(''),
    certificate_path: new FormControl(''),
    certificate_password: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    crt: new FormControl(0),
    special_regime: new FormControl(0),
    address: new FormGroup({
      zip_code: new FormControl(''),
      address: new FormControl(''),
      number: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      district: new FormControl(''),
      complement: new FormControl(''),
      code_ibge: new FormControl(''),
    }),
    transporter: new FormGroup({
      national_transport_registration: new FormControl(''),
      vehicle_owner_type: new FormControl(0),
      transport_type: new FormControl(0),
    }),
    note: new FormControl(''),
    keys: new FormArray([]),
    contacts: new FormArray([]),
    backups: new FormArray([]),
    remoteAccess: new FormArray([]),
    vehicles: new FormArray([]),
  });

  public validationFields: Array<any> = [
    { name: 'document', validation: true, msg: this.myForm.value.people_type === 0 ? 'É necessário informar o CPF' : 'É necessário informar o CNPJ' },
    { name: 'name', validation: true, msg: this.myForm.value.people_type === 0 ? 'É necessário informar o nome' : 'É necessário informar o nome fantasia' },
  ];


  public peopleRole = [
    { name: '⦿ Física', type: 0 },
    { name: '⦿ Juridíca', type: 1 },
  ];

  public peopleRolesList = [
    { id: 0, label: 'Usuário' },
    { id: 1, label: 'Empresa' },
    { id: 2, label: 'Cliente' },
    { id: 3, label: 'Fornecedor' },
    { id: 4, label: 'Transportadora' }
  ];

  public vehicleOwnerType = [
    { name: '⦿ Agregado (TAC)', type: 0 },
    { name: '⦿ Independente (TAC)', type: 1 },
    { name: '⦿ Outros', type: 2 },
  ];

  public transportType = [
    { name: '⦿ Empresa de Transporte de Cargas (ETC)', type: 1 },
    { name: '⦿ Transportador Autônomo de Cargas (TAC)', type: 2 },
    { name: '⦿ Cooperativa de Transporte de Cargas (CTC)', type: 3 },
  ];

  public stateRegistrationIndicator = [
    { name: '⦿ Não contribuinte', type: 9 },
    { name: '⦿ Contribuinte', type: 1 },
    { name: '⦿ Contribuinte isento', type: 2 },
  ];

  public crt = [
    { name: '⦿ Simples Nacional', type: 0 },
    { name: '⦿ Simples Nacional, Excesso sublimete de receita bruta', type: 1 },
    { name: '⦿ Regime Normal', type: 2 },
    { name: '⦿ Simples Nacional - Microempreendedor individual - MEI', type: 3 },
  ];

  public specialRegime = [
    { name: '⦿ Sem Regime Especial', type: 0 },
    { name: '⦿ Microempresa Municipal', type: 1 },
    { name: '⦿ Estimativa', type: 2 },
    { name: '⦿ Sociedade de Profissionais', type: 3 },
    { name: '⦿ Cooperaiva', type: 4 },
    { name: '⦿ Microempresário Individual (MEI)', type: 5 },
    { name: '⦿ Microempresário e Empresa de Pequeo Porte(ME/EPP)', type: 6 },
    { name: '⦿ Lucro real', type: 7 },
  ];

  @ViewChild('fileInputCertificado') fileInputCertificado!: ElementRef<HTMLInputElement>;
  public certificado: DropboxFile | undefined;

  public contacts = this.myForm.get('contacts') as FormArray;

  @Output() searchPeople: SearchLoadingUniqueInterface = {
    noTitle: false,
    title: 'Cliente',
    url: 'people',
    searchFieldOn: null,
    searchFieldOnCollum: ['name', 'social_name', 'document'],
    sortedBy: 'name',
    orderBy: 'name',
    searchField: new FormControl(''),
    validation: true,
    paramsArray: [
    ],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private toast: ToastService,
    private peopleService: PeopleService,
    private router: Router,
    private dropboxService: DropboxService
  ) {
    this.formId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.formId !== 'new') {
      this.peopleService.show(this.formId).pipe(
        catchError(() => {
          this.toast.error('Pessoa não encontrada', 'Não foi possível encontrar a pessoa.');
          this.router.navigate(['people']);
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


      // if (value.keys && value.keys.length > 0) {
      //   for (const key of value.keys) {
      //     this.addKey(key);
      //   }
      // }

      // if (value.contacts && value.contacts.length > 0) {
      //   for (const contact of value.contacts) {
      //     this.addContact({ contact });
      //   }
      // }

      // if (value.vehicles && value.vehicles.length > 0) {
      //   for (const vehicle of value.vehicles) {
      //     this.addVehicle({ vehicle });
      //   }
      // }

      // if (value.backups && value.backups.length > 0) {
      //   for (const backup of value.backups) {
      //     this.addBackup(backup);
      //   }
      // }

      // if (value.remoteAccess && value.remoteAccess.length > 0) {
      //   for (const access of value.remoteAccess) {
      //     this.addRemoteAccess(access);
      //   }
      // }

      // this.listDropboxFolder();
      // this.listDropboxNFe();
      // this.listDropboxNFCe();
      // this.getCertificateDropBox();
    }
  }

  roleActive(role: number): boolean {
    return this.myForm.value.roles.includes(role);
  }

  onRoleChange(role: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      // Adicionar o role se não existir
      if (!this.myForm.value.roles.includes(role)) {
        this.myForm.value.roles.push(role);
      }
    } else {
      // Verificar se pode remover o role
      if (this.myForm.value.roles.length > 1) {
        this.myForm.value.roles = this.myForm.value.roles.filter(() => role !== role);
      } else {
        // Se for o único role, impedir desmarcar
        checkbox.checked = true;
      }
    }
  }

  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB',
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  getDetailsCertificado(): string {
    if (this.certificado) {
      return this.certificado?.name + ' - ' + this.formatBytes(this.certificado?.size)
    } else {
      return ''
    }
  }

  selectCertificadoButton(): void {
    this.fileInputCertificado.nativeElement.click();
  }

  selectCertificado(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const documentPath = this.myForm.controls['document'].value || '';
      if (documentPath) {
        const arquivo = input.files[0];

        if (arquivo.name.endsWith('.pfx')) {
          const path = `/Backups/${documentPath}/Certificado/certificado.pfx`; // Define o caminho no Dropbox

          this.dropboxService.uploadFile(arquivo, path).subscribe({
            next: (response) => {
              this.myForm.controls['certificate_path'].setValue(response.path_display);
              this.certificado = response;
            },
            error: (error) => {
              console.error('Erro no upload:', error)
            },
          });

        } else {
          alert('Por favor, selecione um arquivo .pfx');
          input.value = ''; // Reseta o input
        }
      }
    }
  }

  getCNPJ(): void {
    this.peopleService.cnpj(this.myForm.value.document).subscribe({
      next: (cnpj) => {
        this.myForm.controls['name'].setValue(cnpj["estabelecimento"]["nome_fantasia"]);
        this.myForm.controls['social_name'].setValue(cnpj["razao_social"]);
        (this.myForm.get('address') as FormGroup).controls['zip_code'].setValue(cnpj["estabelecimento"]["cep"]);
        const birth = new Date();
        const birthGet = cnpj["estabelecimento"]["data_inicio_atividade"].replace(/\D+/g, '');
        birth.setDate(birthGet.substring(6, 8));
        birth.setFullYear(birthGet.substring(0, 4));
        birth.setMonth(birthGet.substring(4, 6) - 1);
        //this.myForm.controls['birth'].setValue(this.datePipe.transform(birth, 'yyyy-MM-dd'));
        this.myForm.controls['phone'].setValue(cnpj["estabelecimento"]["ddd1"] + cnpj["estabelecimento"]["telefone1"]);
        this.myForm.controls['email'].setValue(cnpj["estabelecimento"]["email"]);
        (this.myForm.get('address') as FormGroup).controls['address'].setValue(cnpj["estabelecimento"]["logradouro"]);
        (this.myForm.get('address') as FormGroup).controls['number'].setValue(cnpj["estabelecimento"]["numero"]);
        (this.myForm.get('address') as FormGroup).controls['complement'].setValue(cnpj["estabelecimento"]["complemento"]);
        (this.myForm.get('address') as FormGroup).controls['district'].setValue(cnpj["estabelecimento"]["bairro"]);
        (this.myForm.get('address') as FormGroup).controls['city'].setValue(cnpj["estabelecimento"]["cidade"]["nome"]);
        (this.myForm.get('address') as FormGroup).controls['state'].setValue(cnpj["estabelecimento"]["estado"]["sigla"]);
        (this.myForm.get('address') as FormGroup).controls['code_ibge'].setValue(cnpj["estabelecimento"]["cidade"]["ibge_id"]);
      },
      error: () => {
        this.toast.error('Consulta CNPJ', 'Não foi possível encontrar o CNPJ.');
      }
    })
  }

  getCEP(): void {
    this.peopleService.cep(this.myForm.value.address.zip_code).subscribe({
      next: (cep) => {
        (this.myForm.get('address') as FormGroup).controls['address'].setValue(cep["logradouro"]);
        (this.myForm.get('address') as FormGroup).controls['number'].setValue(cep["NUMERO"]);
        (this.myForm.get('address') as FormGroup).controls['complement'].setValue(cep["complemento"]);
        (this.myForm.get('address') as FormGroup).controls['district'].setValue(cep["bairro"]);
        (this.myForm.get('address') as FormGroup).controls['city'].setValue(cep["localidade"]);
        (this.myForm.get('address') as FormGroup).controls['state'].setValue(cep["uf"]);
        (this.myForm.get('address') as FormGroup).controls['code_ibge'].setValue(cep["ibge"]);
      },
      error: () => {
        this.toast.error('Consulta CEP', 'Não foi possível encontrar o CEP.');
      }
    })
  }

  validateForm(): void {
    this.validationFields.find((v) => v.name === 'name').validation = !!this.myForm.value.name;
    this.validationFields.find((v) => v.name === 'document').validation = !!this.myForm.value.document;
  }

  save(): void {
    this.validateForm();

    if (this.myForm.valid) {

      // this.myForm.value.contacts = this.myForm.value.contacts.map(
      //   (contact) => contact.contact_id
      // );

      // this.myForm.value.vehicles = this.myForm.value.vehicles.map(
      //   (vehicle) => vehicle.vehicle_id
      // );

      this.peopleService.save(this.formId, this.myForm.value).subscribe({
        next: () => {
          this.toast.success('Sucesso!', this.formId == 'new' ? 'Cadastrado com sucesso' : 'Atualizado com sucesso');
          this.router.navigate(['people']);
        },
        error: (res) => {
          let title = 'Atenção';
          let message = 'Ocorreu um erro ao realizar o cadastro, tente novamente mais tarde.';

          if (res?.error?.errors?.[0]?.field === 'document') {
            title = this.myForm.value.people_type === 0 ? 'Campo CPF' : 'Campo CNPJ';
            message = res.error.errors[0].message;
          }

          if (res?.error?.errors?.[0]?.field === 'name') {
            title = this.myForm.value.people_type === 0 ? 'Campo Nome' : 'Campo Nome Fantasia';
            message = res.error.errors[0].message;
          }

          this.toast.error(title, message);
        }
      })
    } else {
      this.toast.warning('Campos inválidos', 'Existem campos a serem preenchidos corretamente.')
    }
  }

  receberSelecionado(item: any) {
    if (item) {
      console.log('Item selecionado:', item);

      // Exemplo 1: Se você quiser salvar apenas o ID no formulário principal
      this.myForm.patchValue({
        client_id: item.id // Supondo que seu form tenha um campo client_id
      });

      // Exemplo 2: Se quiser preencher outros campos automaticamente
      // this.myForm.patchValue({
      //   email: item.email,
      //   phone: item.phone
      // });

    } else {
      console.log('Item removido (limpo)');

      // Se o usuário clicou no "X", você limpa o campo no formulário
      this.myForm.patchValue({
        client_id: null
      });
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  nextTab() {
    const tabs = ['dados', 'fiscal', 'endereco', 'observacao'];
    const i = tabs.indexOf(this.activeTab);
    if (i < tabs.length - 1) this.activeTab = tabs[i + 1];
  }

  prevTab() {
    const tabs = ['dados', 'fiscal', 'endereco', 'observacao'];
    const i = tabs.indexOf(this.activeTab);
    if (i > 0) this.activeTab = tabs[i - 1];
  }

  // Adicionar nova linha
  addContact() {
    //this.contacts.push({ type: '', email: '', phone: '' });
  }

  // Remover linha específica
  removeContact(index: number) {
    //this.contacts.splice(index, 1);
  }

  // Adicionar Veículo
  addVehicle() {
    this.vehicles.push({ brand: '', model: '', year: '', plate: '' });
  }

  // Remover Veículo
  removeVehicle(index: number) {
    this.vehicles.splice(index, 1);
  }

  addKey() {
    this.keys.push({ type: '', date: '', value: '' });
  }

  removeKey(index: number) {
    this.keys.splice(index, 1);
  }

  // Lógica para gerar chave aleatória (Simulação)
  generateKey(index: number) {
    const randomKey = 'XXXX-XXXX-XXXX-XXXX'.replace(/X/g, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36))
    );
    this.keys[index].value = randomKey;
  }

  // Simular envio de email
  sendEmail(index: number) {
    alert(`Chave enviada para o email do cliente: ${this.keys[index].value}`);
  }

  // Calcular dias restantes e retornar objeto com texto e cor
  getKeyStatus(dateString: string): { text: string, colorClass: string } {
    if (!dateString) return { text: 'Defina a validade', colorClass: 'text-slate-500' };

    const today = new Date();
    const target = new Date(dateString);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Vencida há ${Math.abs(diffDays)} dias`, colorClass: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' };
    } else if (diffDays <= 15) {
      return { text: `Vence em ${diffDays} dias`, colorClass: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' };
    } else {
      return { text: `${diffDays} dias para vencer`, colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' };
    }
  }

  addRemote() {
    this.remotes.push({ type: 'AnyDesk', name: '', id: '', password: '' });
  }

  removeRemote(index: number) {
    this.remotes.splice(index, 1);
  }

  // Gera o link mágico para abrir o app
  getRemoteLink(remote: any): string {
    const cleanId = remote.id.replace(/\s/g, ''); // Remove espaços do ID

    if (remote.type === 'AnyDesk') {
      return `anydesk:${cleanId}`;
    }
    if (remote.type === 'RustDesk') {
      // RustDesk usa URI scheme ou copia pro clipboard (depende da versão/OS)
      // Tenta o padrão de URI
      return `rustdesk://${cleanId}`;
    }
    if (remote.type === 'TeamViewer') {
       return `teamviewer10://${cleanId}`;
    }
    return '#';
  }
}

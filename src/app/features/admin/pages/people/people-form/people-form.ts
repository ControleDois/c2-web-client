import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-people-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './people-form.html',
  styleUrl: './people-form.css',
})
export class PeopleForm {
  // Controle de Abas
  activeTab: string = 'dados'; // 'dados' | 'fiscal' | 'endereco' | 'observacao'

  // Controle de Tipo de Pessoa (Física vs Jurídica)
  tipoPessoa: 'Fisica' | 'Juridica' = 'Juridica'; // Padrão conforme imagem, mas alterável

  contacts: any[] = [
    { type: 'Comercial', email: '', phone: '' } // Começa com um vazio
  ];

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

  // Função para mudar aba
  setTab(tab: string) {
    this.activeTab = tab;
  }

  // Navegação pelos botões inferiores
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
    this.contacts.push({ type: '', email: '', phone: '' });
  }

  // Remover linha específica
  removeContact(index: number) {
    this.contacts.splice(index, 1);
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

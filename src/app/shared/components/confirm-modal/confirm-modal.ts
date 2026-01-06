import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

// Tipos permitidos para controlar o estilo
export type ModalType = 'danger' | 'success' | 'info';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  animations: [
    // Animação do Fundo Escuro (Backdrop)
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),

    // Animação do Painel do Modal (Zoom + Fade)
    trigger('panel', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }))
      ])
    ])
  ]
})
export class ConfirmModal {
  // Controle de visibilidade
  @Input() isOpen = false;

  // Configurações de Texto
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';

  // O "Type" define a cor e o ícone
  // 'danger' = Vermelho (Excluir)
  // 'success' = Verde (Aprovar)
  // 'info' = Azul/Indigo (Imprimir, Enviar Email)
  @Input() type: ModalType = 'danger';

  // Eventos de Saída
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>(); // Fecha o modal

  // Helper para pegar as classes de cor baseadas no tipo
  get colorClasses() {
    switch (this.type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconText: 'text-red-600 dark:text-red-400',
          btnBg: 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
          btnText: 'text-white'
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/20',
          iconText: 'text-emerald-600 dark:text-emerald-400',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600',
          btnText: 'text-white'
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-indigo-100 dark:bg-indigo-900/20',
          iconText: 'text-indigo-600 dark:text-indigo-400',
          btnBg: 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
          btnText: 'text-white'
        };
    }
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}

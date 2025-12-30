import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Tipos permitidos
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastState {
  show: boolean;
  title?: string;
  message?: string;
  type?: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private state = new BehaviorSubject<ToastState>({ show: false });
  toastState$ = this.state.asObservable();

  // Método genérico privado
  private show(title: string, message: string, type: ToastType) {
    this.state.next({ show: true, title, message, type });
    // Fecha sozinho após 4s (pode aumentar se for erro)
    setTimeout(() => this.hide(), type === 'error' ? 6000 : 4000);
  }

  // Métodos públicos fáceis de usar
  success(title: string, message: string) {
    this.show(title, message, 'success');
  }

  error(title: string, message: string) {
    this.show(title, message, 'error');
  }

  warning(title: string, message: string) {
    this.show(title, message, 'warning');
  }

  info(title: string, message: string) {
    this.show(title, message, 'info');
  }

  hide() {
    this.state.next({ show: false });
  }
}

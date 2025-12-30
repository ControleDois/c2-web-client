import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private requestCount = 0;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.isLoading.next(true);
    }
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    if (this.requestCount === 0) {
      this.isLoading.next(false);
    }
  }

  // Caso precise forçar o fechamento (ex: erro crítico que travou contador)
  reset() {
    this.requestCount = 0;
    this.isLoading.next(false);
  }
}

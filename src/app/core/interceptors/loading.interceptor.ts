import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService); // <--- A mágica da injeção moderna

  // Verifica se deve pular o loading
  if (req.headers.has('X-Skip-Loading')) {
    const newReq = req.clone({ headers: req.headers.delete('X-Skip-Loading') });
    return next(newReq);
  }

  // Ativa o loading
  loadingService.show();

  // Segue o fluxo
  return next(req).pipe(
    finalize(() => {
      // Desativa ao terminar (sucesso ou erro)
      loadingService.hide();
    })
  );
};

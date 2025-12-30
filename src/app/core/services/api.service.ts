import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs";
import { StorageService } from './storage.service';
import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private storageAuth: Auth | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.storageAuth = this.storageService.getAuth();
  }

  on(url: string, body: any, method: string, params?: HttpParams, skipLoading: boolean = false): Observable<any> {
    this.storageAuth = this.storageService.getAuth();

    if (body?.hasOwnProperty('company_id') && this.storageAuth?.company?.id) {
      body['company_id'] = this.storageAuth.company.id;
    }

    const companyIdParam = this.storageAuth?.company?.id ? `?companyId=${this.storageAuth.company.id}` : '';

    switch (method) {
      // --- CASOS COM TOKEN ---
      case 'post-token':
        return this.http.post(
          `${environment.api}/${url}${companyIdParam}`,
          body,
          this.getHttpHeaders(skipLoading) // Passa o flag
        );

      case 'get-token':
        return this.http.get(
          `${environment.api}/${url}${companyIdParam}`,
          this.getHttpHeaders(skipLoading)
        );

      case 'get-token-params':
        const options = this.getHttpHeaders(skipLoading);
        options.params = params;

        return this.http.get(`${environment.api}/${url}${companyIdParam}`, options);

      case 'put-token':
        return this.http.put(
          `${environment.api}/${url}${companyIdParam}`,
          body,
          this.getHttpHeaders(skipLoading)
        );

      case 'delete-token':
        return this.http.delete(
          `${environment.api}/${url}${companyIdParam}`,
          this.getHttpHeaders(skipLoading)
        );

      // --- CASOS PÚBLICOS (SEM TOKEN) ---
      case 'post':
        return this.http.post(`${environment.api}/${url}`, body, this.getPublicHeaders(skipLoading));

      case 'post-file':
        return this.http.post(`${url}`, body, this.getPublicHeaders(skipLoading));

      case 'get-no-environment':
        return this.http.get(url, this.getPublicHeaders(skipLoading));

      case 'get':
        return this.http.get(`${environment.api}/${url}`, this.getPublicHeaders(skipLoading));

      case 'put':
        return this.http.put(`${environment.api}/${url}`, body, this.getPublicHeaders(skipLoading));

      default:
        return this.http.get('', this.getPublicHeaders(skipLoading));
    }
  }

  getHttpHeaders(skipLoading: boolean): { headers: HttpHeaders, params?: HttpParams } {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.storageService.getAuth()?.token.token,
    });

    if (skipLoading) {
      headers = headers.append('X-Skip-Loading', 'true');
    }

    return { headers };
  }

  private getPublicHeaders(skipLoading: boolean): { headers: HttpHeaders } | undefined {
    if (!skipLoading) {
      return undefined;
    }
    return {
      headers: new HttpHeaders({ 'X-Skip-Loading': 'true' })
    };
  }
}

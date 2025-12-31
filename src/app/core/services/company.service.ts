import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private resource = 'company';

  constructor(
    private apiService: ApiService,
  ) {}

  index(search: string, sorteBy?: string, orderBy?: string, page?: string, limit?: string, skipLoading: boolean = false): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('sortedBy', sorteBy || 'name')
      .set('orderBy', orderBy || 'name')
      .set('page', page || '1')
      .set('limit', limit || '10');

    return this.apiService.on(this.resource, '', 'get-token-params', params, skipLoading);
  }

  select(id: string): Observable<any> {
    return this.apiService.on(`${this.resource}/select/${id}`, '', 'get-token');
  }
}

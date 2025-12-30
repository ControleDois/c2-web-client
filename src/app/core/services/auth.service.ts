import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private resource = 'auth';
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    private apiService: ApiService,
  ) {
    const token = localStorage.getItem('token');
    this.loggedIn.next(!!token);
  }

  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }

  signin(user: User): Observable<any> {
    return this.apiService.on(`${this.resource}/signin`, {
      email: user.email,
      password: user.password
    }, 'post');
  }
}

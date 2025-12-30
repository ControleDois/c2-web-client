import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { catchError, map } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  public myForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router
  ) {}

  public signin() {
    this.authService.signin(this.myForm.value).pipe(
      catchError(() => {
        this.toastService.error('Login inválido', 'Verifique os dados e tente novamente.');
        return [];
      }),
      map((res: any) => {
        this.storageService.setAuth(res);
        this.router.navigate(['/company-selection']);
      })
    ).subscribe()
  }
}

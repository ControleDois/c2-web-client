import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { People } from '../../../../core/interfaces/people.interface';
import { CompanyService } from '../../../../core/services/company.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, startWith, switchMap } from 'rxjs';
import { StorageService } from '../../../../core/services/storage.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-company-selection',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './company-selection.html',
  styleUrl: './company-selection.css',
})
export class CompanySelection implements OnInit {
  public companies: People[] = [];
  public isLoading = false;

  public search = new FormControl('');

  constructor(
    private companyService: CompanyService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.search?.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          this.isLoading = true;
          this.cdr.detectChanges();

          return this.companyService.index(term || '', 'name', 'name', '1', '9', true).pipe(
            catchError((err) => {
              this.toast.error('Erro', 'Falha ao buscar empresas.');
              console.error(err);
              return of({ data: [] });
            }),
            finalize(() => this.isLoading = false)
          );
        })
      )
      .subscribe({
        next: (response: any) => {
          this.companies = response.data || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectCompany(company: People) {
    this.companyService.select(company.company_id).pipe(
      catchError(() => {
        this.toast.error('Empresa não encontrada', 'Não foi possível selecionar a empresa.');
        return [];
      }),
      map((res) => {
        const auth = this.storageService.getAuth();
        if (auth) {
          auth.company = res;
          this.storageService.setAuth(auth);
          this.toast.success('Empresa Selecionada', `Ambiente: ${res.people.name}`);
          this.router.navigate(['dash']);
        }
      })
    ).subscribe();
  }
}

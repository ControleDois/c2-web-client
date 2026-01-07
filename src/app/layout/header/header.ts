import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { AuthService } from '../../core/services/auth.service';
import { Auth } from '../../core/interfaces/auth.interface';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.html',
})
export class Header {
  public auth: Auth | null;
  @Output() toggleMenu = new EventEmitter<void>();

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
  ) {
    this.auth = this.storageService.getAuth();
  }

  logout() {
    this.authService.logout();
  }
}

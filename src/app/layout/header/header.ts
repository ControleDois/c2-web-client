import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { AuthService } from '../../core/services/auth.service';
import { Auth } from '../../core/interfaces/auth.interface';

@Component({
  selector: 'app-header',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public auth: Auth | null;

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

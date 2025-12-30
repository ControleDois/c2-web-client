import { Component } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  constructor(
    private storageService: StorageService,
  ) {}

  logout() {
    //
  }
}

import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Breadcrumb } from '../breadcrumb/breadcrumb';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, Header, Sidebar, RouterOutlet, Breadcrumb],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  sidebarOpen = false;
}

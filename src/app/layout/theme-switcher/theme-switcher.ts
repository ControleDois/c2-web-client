import { Component } from '@angular/core';
import { ThemeService, ThemeType } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  imports: [CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css',
})
export class ThemeSwitcher {

  constructor(
    private themeService: ThemeService
  ) {
  }

  isActive(type: ThemeType): boolean {
    return this.themeService.theme() === type;
  }

  set(type: ThemeType) {
    this.themeService.setTheme(type);
  }
}

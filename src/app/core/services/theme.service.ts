import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ThemeType = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);

  theme = signal<ThemeType>('system');

  constructor() {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      this.theme.set(savedTheme);
    }

    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem('theme', currentTheme);
      this.applyTheme(currentTheme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.applyTheme('system');
      }
    });
  }

  setTheme(newTheme: ThemeType) {
    this.theme.set(newTheme);
  }

  private applyTheme(theme: ThemeType) {
    const html = this.document.documentElement;

    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }
}

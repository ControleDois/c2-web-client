import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbItem } from '../../core/interfaces/breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });

    // Inicializa na carga da página
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Pega o nome definido no data: { title: '...' }
      const label = child.snapshot.data['title'];

      // Se tiver label, adiciona na lista (evita rotas vazias ou auxiliares)
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}

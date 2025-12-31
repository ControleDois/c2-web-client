import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PeopleService } from '../../../../../core/services/people.service';
import { People } from '../../../../../core/interfaces/people.interface';
import { MetaData } from '../../../../../core/interfaces/api-response.interface';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-people-list',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './people-list.html',
  styleUrl: './people-list.css',
})
export class PeopleList {

  protected Math = Math;
  people: People[] = [];
  meta: MetaData | null = null;
  isLoading = true;

  constructor(
    private peopleService: PeopleService,
    private cdr: ChangeDetectorRef,
  ) {
  }


  ngOnInit() {
    this.loadData(1);
  }

  loadData(page: number) {
    this.isLoading = true;

    this.peopleService.index('',
      'name', 'name', page.toString(),'10', [], true).pipe(
        map(res => {
          this.people = res.data;
          this.meta = res.meta;
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      ).subscribe();
  }

  nextPage() {
    if (this.meta && this.meta.current_page < this.meta.last_page) {
      this.loadData(this.meta.current_page + 1);
    }
  }

  prevPage() {
    if (this.meta && this.meta.current_page > 1) {
      this.loadData(this.meta.current_page - 1);
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReceivementForm } from './bill-receivement-form';

describe('BillReceivementForm', () => {
  let component: BillReceivementForm;
  let fixture: ComponentFixture<BillReceivementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillReceivementForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillReceivementForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

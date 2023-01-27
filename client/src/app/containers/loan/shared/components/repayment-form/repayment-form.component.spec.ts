import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentFormComponent } from './repayment-form.component';

describe('RepaymentFormComponent', () => {
  let component: RepaymentFormComponent;
  let fixture: ComponentFixture<RepaymentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepaymentFormComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

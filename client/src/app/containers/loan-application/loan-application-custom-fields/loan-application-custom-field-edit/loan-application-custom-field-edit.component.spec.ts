import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationCustomFieldEditComponent } from './loan-application-custom-field-edit.component';

describe('LoanApplicationCustomFieldEditComponent', () => {
  let component: LoanApplicationCustomFieldEditComponent;
  let fixture: ComponentFixture<LoanApplicationCustomFieldEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanApplicationCustomFieldEditComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationCustomFieldEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

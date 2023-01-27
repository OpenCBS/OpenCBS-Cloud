import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationCustomFieldInfoComponent } from './loan-application-custom-field-info.component';

describe('LoanApplicationCustomFieldInfoComponent', () => {
  let component: LoanApplicationCustomFieldInfoComponent;
  let fixture: ComponentFixture<LoanApplicationCustomFieldInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanApplicationCustomFieldInfoComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationCustomFieldInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

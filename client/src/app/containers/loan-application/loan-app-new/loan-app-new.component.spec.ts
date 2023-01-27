import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAppNewComponent } from './loan-app-new.component';

describe('LoanAppNewComponent', () => {
  let component: LoanAppNewComponent;
  let fixture: ComponentFixture<LoanAppNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanAppNewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAppNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

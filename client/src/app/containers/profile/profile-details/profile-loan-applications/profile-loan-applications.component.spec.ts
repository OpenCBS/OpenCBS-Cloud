import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLoanApplicationsComponent } from './profile-loan-applications.component';

describe('ProfileLoanApplicationsComponent', () => {
  let component: ProfileLoanApplicationsComponent;
  let fixture: ComponentFixture<ProfileLoanApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileLoanApplicationsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLoanApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

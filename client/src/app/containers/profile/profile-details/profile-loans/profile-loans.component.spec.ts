import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLoansComponent } from './profile-loans.component';

describe('ProfileLoansComponent', () => {
  let component: ProfileLoansComponent;
  let fixture: ComponentFixture<ProfileLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileLoansComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

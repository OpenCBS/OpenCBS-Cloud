import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BondsComponent } from './savings.component';

describe('SavingsComponent', () => {
  let component: BondsComponent;
  let fixture: ComponentFixture<BondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BondsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

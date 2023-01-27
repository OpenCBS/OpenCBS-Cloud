import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeesBlockComponent } from './payees-block.component';

describe('PayeesBlockComponent', () => {
  let component: PayeesBlockComponent;
  let fixture: ComponentFixture<PayeesBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayeesBlockComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeesBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

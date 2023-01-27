import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeBlockComponent } from './payee-block.component';

describe('PayeeBlockComponent', () => {
  let component: PayeeBlockComponent;
  let fixture: ComponentFixture<PayeeBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayeeBlockComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

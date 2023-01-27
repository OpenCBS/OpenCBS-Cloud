import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingProductEditComponent } from './saving-product-edit.component';

describe('SavingProductEditComponent', () => {
  let component: SavingProductEditComponent;
  let fixture: ComponentFixture<SavingProductEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SavingProductEditComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

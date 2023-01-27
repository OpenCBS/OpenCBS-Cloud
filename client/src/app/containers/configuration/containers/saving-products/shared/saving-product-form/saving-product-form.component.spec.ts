import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingProductFormComponent } from './saving-product-form.component';

describe('SavingProductFormComponent', () => {
  let component: SavingProductFormComponent;
  let fixture: ComponentFixture<SavingProductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SavingProductFormComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

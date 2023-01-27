import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingProductInfoComponent } from './saving-product-info.component';

describe('SavingProductInfoComponent', () => {
  let component: SavingProductInfoComponent;
  let fixture: ComponentFixture<SavingProductInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SavingProductInfoComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReadonlyControlComponent } from './form-readonly-control.component';

describe('FormReadonlyControlComponent', () => {
  let component: FormReadonlyControlComponent;
  let fixture: ComponentFixture<FormReadonlyControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormReadonlyControlComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReadonlyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputControlComponent } from './form-input-control.component';

describe('FormInputControlComponent', () => {
  let component: FormInputControlComponent;
  let fixture: ComponentFixture<FormInputControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormInputControlComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInputControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

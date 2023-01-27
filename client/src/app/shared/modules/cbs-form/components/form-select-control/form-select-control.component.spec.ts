import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectControlComponent } from './form-select-control.component';

describe('FormSelectControlComponent', () => {
  let component: FormSelectControlComponent;
  let fixture: ComponentFixture<FormSelectControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormSelectControlComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSelectControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

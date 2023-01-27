import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDateControlComponent } from './form-date-control.component';

describe('FormDateControlComponent', () => {
  let component: FormDateControlComponent;
  let fixture: ComponentFixture<FormDateControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormDateControlComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDateControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

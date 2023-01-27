import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextareaControlComponent } from './form-textarea-control.component';

describe('FormTextareaControlComponent', () => {
  let component: FormTextareaControlComponent;
  let fixture: ComponentFixture<FormTextareaControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormTextareaControlComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTextareaControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

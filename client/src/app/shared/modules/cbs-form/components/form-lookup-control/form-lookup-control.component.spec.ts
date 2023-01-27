import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLookupControlComponent } from './form-lookup-control.component';

describe('FormLookupControlComponent', () => {
  let component: FormLookupControlComponent;
  let fixture: ComponentFixture<FormLookupControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormLookupControlComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLookupControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

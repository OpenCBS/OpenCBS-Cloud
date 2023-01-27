import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLayoutComponent } from './form-layout.component';

describe('FormLayoutComponent', () => {
  let component: FormLayoutComponent;
  let fixture: ComponentFixture<FormLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormLayoutComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

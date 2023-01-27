import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWrapComponent } from './settings-wrap.component';

describe('SettingsWrapComponent', () => {
  let component: SettingsWrapComponent;
  let fixture: ComponentFixture<SettingsWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsWrapComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

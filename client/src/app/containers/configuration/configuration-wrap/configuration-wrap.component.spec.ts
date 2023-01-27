import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationWrapComponent } from './configuration-wrap.component';

describe('ConfigurationWrapComponent', () => {
  let component: ConfigurationWrapComponent;
  let fixture: ComponentFixture<ConfigurationWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationWrapComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

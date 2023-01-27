import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TillsComponent } from './tills.component';

describe('TillsComponent', () => {
  let component: TillsComponent;
  let fixture: ComponentFixture<TillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TillsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

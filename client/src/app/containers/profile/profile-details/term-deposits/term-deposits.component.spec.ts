import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDepositsComponent } from './term-deposits.component';

describe('TermDepositsComponent', () => {
  let component: TermDepositsComponent;
  let fixture: ComponentFixture<TermDepositsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TermDepositsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

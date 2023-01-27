import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryFeesBlockComponent } from './entry-fees-block.component';

describe('EntryFeesBlockComponent', () => {
  let component: EntryFeesBlockComponent;
  let fixture: ComponentFixture<EntryFeesBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryFeesBlockComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryFeesBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

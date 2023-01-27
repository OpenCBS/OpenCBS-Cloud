import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryFeesFormModalComponent } from './entry-fees-modal.component';


describe('OtherFeesListFormModalComponent', () => {
  let component: EntryFeesFormModalComponent;
  let fixture: ComponentFixture<EntryFeesFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryFeesFormModalComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryFeesFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

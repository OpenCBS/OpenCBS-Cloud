import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cbs-entry-fees-selected',
  templateUrl: 'entry-fees-selected.component.html',
  styleUrls: ['entry-fees-selected.component.scss']
})

export class SelectedEntryFeesComponent {
  @Input() label: string;
  @Input() selectedEntryFees = [];
  @Output() onFeeDelete = new EventEmitter();
  @Input() displayButton = true;

  constructor() {
  }

  delete(entryFee) {
    this.selectedEntryFees.filter(a => {
      if ( a.id === entryFee.id ) {
        this.selectedEntryFees.splice(this.selectedEntryFees.indexOf(a), 1);
      }
    });
    this.onFeeDelete.emit(entryFee);
  }
}

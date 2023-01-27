import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'cbs-entry-fee-picklist',
  templateUrl: 'entry-fee-picklist.component.html',
  styleUrls: ['entry-fee-picklist.component.scss']
})

export class EntryFeesPicklistComponent {
  @Input() entryFees = [];
  @Input() selectDataLabel: string;
  @Input() disablePickList: string;
  @Output() onFeeSelect = new EventEmitter();
  public pick: any = [];
  public open: boolean;

  constructor() {
  }

  selectEntryFee(entryFee) {
    this.entryFees.filter(a => {
      if ( a['name'] === entryFee.name ) {
        this.entryFees.splice(this.entryFees.indexOf(a), 1);
      }
    });
    this.onFeeSelect.emit(entryFee);
  }

}

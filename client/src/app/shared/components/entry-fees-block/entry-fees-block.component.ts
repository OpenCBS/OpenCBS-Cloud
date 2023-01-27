import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEntryFeeItem } from '../../../core/store/loan-application/loan-application-form/loan-application-form.interfaces';

@Component({
  selector: 'cbs-entry-fees-block',
  templateUrl: './entry-fees-block.component.html',
  styleUrls: ['./entry-fees-block.component.scss']
})
export class EntryFeesBlockComponent {
  @Input() entryFeesData: IEntryFeeItem[];
  @Input() isValidToCalculate: boolean;
  @Output() onDetailsClick = new EventEmitter();

  getTotal() {
    let total = 0;
    this.entryFeesData.map((item) => {
      total += item.amount;
    });
    return total;
  }

}

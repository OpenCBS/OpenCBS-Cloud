import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPayeeItem } from '../../../core/store/loan-application/loan-application-form/loan-application-form.interfaces';

@Component({
  selector: 'cbs-payees-block-control',
  templateUrl: './payees-block.component.html',
  styleUrls: ['./payees-block.component.scss']
})
export class PayeesBlockComponent {
  @Input() payeesData: IPayeeItem[];
  @Input() readonly = false;
  @Input() isCollapsed = true;
  @Input() showEditBtn: boolean;
  @Input() payeesCount: number;
  @Output() onEditPayee = new EventEmitter();
  @Output() onDeletePayee = new EventEmitter();
  @Output() onAddPayee = new EventEmitter();

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getTotal() {
    let total = 0;
    this.payeesData.map((item) => {
      if (!item['isDeleted']) {
        total += +item.amount;
      }
    });
    return total;
  }
}

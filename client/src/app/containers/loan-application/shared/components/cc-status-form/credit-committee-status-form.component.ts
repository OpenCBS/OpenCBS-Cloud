import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CurrentUserAppState } from '../../../../../core/store';
import { LoanAppStatus } from '../../../../../core/loan-application-status.enum';

@Component({
  selector: 'cbs-cc-status-form',
  templateUrl: 'credit-committee-status-form.component.html',
  styleUrls: ['credit-committee-status-form.component.scss']
})

export class CCStatusFormComponent {
  @Input() ccMember: any;
  @Input() index: number;
  @Input() loanAppStatus: string;
  @Input() currentUser: CurrentUserAppState;
  @Output() onMakeDecision = new EventEmitter();
  public statuses = [
    {
      value: LoanAppStatus[LoanAppStatus.APPROVED],
      caption: 'APPROVE',
      color: 'cbs-status--approved',
      checked: true
    },
    {
      value: LoanAppStatus[LoanAppStatus.REJECTED],
      caption: 'REJECTED',
      color: 'cbs-status--declined',
      checked: false

    },
    {
      value: LoanAppStatus[LoanAppStatus.IN_PROGRESS],
      caption: 'REFER',
      color: 'cbs-status--review',
      checked: false
    }
  ];

  constructor() {
  }

  onStatusClick(ccMember, status) {
    const decision = {
      ccMember: ccMember,
      status: status
    };
    this.onMakeDecision.emit(decision);
  }

}

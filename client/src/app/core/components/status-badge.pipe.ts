import { Pipe, PipeTransform } from '@angular/core';
import { LoanAppStatus } from '../loan-application-status.enum';

@Pipe({
  name: 'statusBadge'
})
export class StatusBadgePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case LoanAppStatus[LoanAppStatus.DISBURSED]:
        return 'info';
      case LoanAppStatus[LoanAppStatus.APPROVED]:
      case LoanAppStatus[LoanAppStatus.ACTIVE]:
      case LoanAppStatus[LoanAppStatus.OPEN]:
      case LoanAppStatus[LoanAppStatus.SOLD]:
        return 'success';
      case LoanAppStatus[LoanAppStatus.REJECTED]:
        return 'error';
      case LoanAppStatus[LoanAppStatus.IN_PROGRESS]:
        return 'warning';
      default:
        return '';
    }
  }
}

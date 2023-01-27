import { LoanAppStatus } from '../../core/loan-application-status.enum';

export function LoanAppStatusAware(constructor: Function) {
  constructor.prototype.LoanAppStatus = LoanAppStatus;
}

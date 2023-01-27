import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ParseDateFormatService } from '../../../../core/services';

@Injectable()
export class LoanAppFormExtraService {
  public maxMaturityDate: string
  private formStatusSource = new Subject<boolean>();
  private loanAppStateSource = new Subject<any>();
  formStatusSourceChanged$ = this.formStatusSource.asObservable();
  loanAppStateSourceChange$ = this.loanAppStateSource.asObservable();

  constructor(private httpClient: HttpClient,
              private parseDateFormatService: ParseDateFormatService) {
  }

  announceFormStatusChange(bool: boolean) {
    this.formStatusSource.next(bool);
  }

  setState(data) {
    this.loanAppStateSource.next(data);
  }

  setMaxMaturityDate(val) {
    this.maxMaturityDate = val;
  }

  getMaxMaturityDate() {
    return this.maxMaturityDate
  }

  getPreferredRepaymentDate(scheduleType) {
    return this.httpClient.get(`${environment.API_ENDPOINT}schedule-preferred-repayment-dates?scheduleType=${scheduleType}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getProfileData(id) {
    return this.httpClient.get<any>(`${environment.API_ENDPOINT}profiles/groups/${id}`).pipe(delay(environment.RESPONSE_DELAY));
  }

  getCreditLines(profileId) {
    return this.httpClient.get<any>(`${environment.API_ENDPOINT}credit-lines/loan-applications/${profileId}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  checkForWeekend(date): boolean {
    if ( date === undefined || date === null ) {
      return null;
    }

    if ( date ) {
      date = this.parseDateFormatService.parseDateValue(date);
    }

    const validDate = moment(date, 'YYYY-MM-DD');
    return validDate.isoWeekday() === 6 || validDate.isoWeekday() === 7;
  }

  subtractPreferredRepaymentFromDisbursementDate(disbursementDate: any, preferredPayDate: any, formType?: string): boolean {
    if ( disbursementDate === undefined || disbursementDate === null || disbursementDate === '' ) {
      return null;
    }

    if ( formType === 'disbursement' && disbursementDate && (preferredPayDate === null || preferredPayDate || preferredPayDate === '') ) {
      return false;
    }

    if ( preferredPayDate === undefined || preferredPayDate === null || preferredPayDate === '' ) {
      return null;

    }

    disbursementDate = this.parseDateFormatService.parseDateValue(disbursementDate);
    preferredPayDate = this.parseDateFormatService.parseDateValue(preferredPayDate);

    const disbursementDateValue = moment(disbursementDate);
    const preferredRepaymentDate = moment(preferredPayDate);
    if (formType === 'maxMaturityDate' ) {
      const dayDiff = moment.duration(preferredRepaymentDate.diff(disbursementDateValue)).asDays();
      return dayDiff < 0;
    } else {
      const dayDiff = moment.duration(preferredRepaymentDate.diff(disbursementDateValue)).asDays();
      return dayDiff < 1;
    }
  }
}

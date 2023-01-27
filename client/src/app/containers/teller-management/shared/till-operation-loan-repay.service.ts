import { fromEvent } from 'rxjs';

import { catchError, delay, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TillOperationLoanRepayService {

  constructor(private httpClient: HttpClient) {
  }

  repayLoanFromTill(loanId, data, tillId, currentInstance?) {
    const url = currentInstance === 'fundaccess'
      ? `${environment.API_ENDPOINT}loans/${loanId}/repayment/tills/${tillId}`
      : `${environment.API_ENDPOINT}loans/${loanId}/repayment/repay`
    return this.httpClient.post<any>(
      url,
      JSON.stringify(data),
      {responseType: 'blob' as 'json'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const reader = new FileReader();
          reader.readAsText(err.error);  // read that message
          return fromEvent(reader, 'loadend').pipe(
            map(() => {
              return JSON.parse(reader.result as string);
            }));
        }));
  }

  repayLoanFromTillKazmicro(loanId, kazmicroRepaymentTellerData, tillId) {
    const url = `${environment.API_ENDPOINT}teller/${loanId}/${tillId}/repay`;
    return this.httpClient.post<any>(
      url,
      JSON.stringify(kazmicroRepaymentTellerData),
      {responseType: 'blob' as 'json'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const reader = new FileReader();
          reader.readAsText(err.error);  // read that message
          return fromEvent(reader, 'loadend').pipe(
            map(() => {
              return JSON.parse(reader.result as string);
            }));
        }));
  }
}

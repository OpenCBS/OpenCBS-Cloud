import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanPayeeInfoService {

  constructor(private httpClient: HttpClient) {
  }

  loadLoanPayee(payeeId) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loan-applications/loan-application-payee/${payeeId}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

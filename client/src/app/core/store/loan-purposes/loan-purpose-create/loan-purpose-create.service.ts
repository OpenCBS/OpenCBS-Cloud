import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanPurposeCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createLoanPurpose(loan_purpose) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loan-purposes`,
      JSON.stringify(loan_purpose))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

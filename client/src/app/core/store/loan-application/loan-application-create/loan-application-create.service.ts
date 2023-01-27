import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanApplicationCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createLoanApplication(loan_application) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loan-applications`,
      JSON.stringify(loan_application))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

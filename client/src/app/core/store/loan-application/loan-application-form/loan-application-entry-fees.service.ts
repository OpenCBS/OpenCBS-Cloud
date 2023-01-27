import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppEntryFeesService {

  constructor(private httpClient: HttpClient) {
  }

  calculateFee(loanApp: any) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loan-applications/calculate-entry-fee`,
      loanApp);
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppGuarantorService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanAppGuarantor(loanAppId, guarantorId) {
    return this.httpClient.get(`${environment.API_ENDPOINT}loan-applications/${loanAppId}/guarantors/${guarantorId}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppUpdateGuarantorService {

  constructor(private httpClient: HttpClient) {
  }

  updateGuarantor(loanAppId, guarantor) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/guarantors/${guarantor.id}`,
      JSON.stringify(guarantor))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

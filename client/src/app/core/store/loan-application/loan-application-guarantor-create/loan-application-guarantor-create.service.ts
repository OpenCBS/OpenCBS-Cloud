import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppGuarantorCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createGuarantor(loanAppId, guarantorData): Observable<any> {
    let url: string;
    url = 'loan-applications/' + loanAppId + '/guarantors';
    return this.httpClient.post(
      `${environment.API_ENDPOINT}${url}`,
      JSON.stringify(guarantorData))
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

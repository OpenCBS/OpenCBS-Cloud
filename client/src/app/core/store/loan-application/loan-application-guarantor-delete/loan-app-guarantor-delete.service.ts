import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppGuarantorDeleteService {

  constructor(private httpClient: HttpClient) {
  }

  deleteLoanApplicationGuarantor(loanAppId, guarantorId): Observable<any> {
    const url = `${environment.API_ENDPOINT}loan-applications/${loanAppId}/guarantors/${guarantorId}`;

    return this.httpClient.delete(url).pipe(delay(environment.RESPONSE_DELAY));
  }

}

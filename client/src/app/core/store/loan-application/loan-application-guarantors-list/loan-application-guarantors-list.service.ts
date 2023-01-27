import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppGuarantorsListService {

  constructor(private httpClient: HttpClient) {
  }

  getGuarantorsList(loanApplicationId): Observable<any> {

    return this.httpClient.get(
      `${environment.API_ENDPOINT}loan-applications/${loanApplicationId}/guarantors`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

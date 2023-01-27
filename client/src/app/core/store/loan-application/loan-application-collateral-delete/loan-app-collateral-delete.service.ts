import { delay, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppCollateralDeleteService {

  constructor(private httpClient: HttpClient) {
  }

  deleteLoanApplicationCollateral(loanAppId, collateralId): Observable<any> {
    const url = `loan-applications/${loanAppId}/collateral/${collateralId}`;

    return this.httpClient.delete(
      `${environment.API_ENDPOINT}${url}`
    ).pipe(
      delay(environment.RESPONSE_DELAY),
      map(res => {
      })
    );
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppCollateralService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanAppCollateral(loanAppId, collateralId) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/collateral/${collateralId}`
    ).pipe(delay(environment.RESPONSE_DELAY));
  }
}

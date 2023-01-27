import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppCollateralUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateCollateral(loanAppId, collateral) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/collateral/${collateral.id}`,
      JSON.stringify(collateral)
    ).pipe(delay(environment.RESPONSE_DELAY));
  }
}

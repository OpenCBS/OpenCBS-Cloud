import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CollateralTypeCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createCollateralType(collateralType) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}types-of-collateral`,
      JSON.stringify(collateralType))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

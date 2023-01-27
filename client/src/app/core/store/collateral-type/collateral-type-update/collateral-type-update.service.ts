import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CollateralTypeUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateCollateralType(collateralType, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}types-of-collateral/${id}`,
      JSON.stringify(collateralType))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

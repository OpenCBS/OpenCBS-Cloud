import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CollateralTypeListService {

  constructor(private httpClient: HttpClient) {
  }

  getCollateralTypeList(): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}types-of-collateral`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

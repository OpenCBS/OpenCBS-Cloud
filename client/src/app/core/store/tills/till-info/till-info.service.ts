import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TillInfoService {

  constructor(private httpClient: HttpClient) {
  }

  getTillInfo(id): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}tills/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  transferToVault(data, isToVault: boolean): Observable<any> {
    const url = isToVault ? `${environment.API_ENDPOINT}tills/transfer/vault` : `${environment.API_ENDPOINT}tills/transfer/till`;
    return this.httpClient.post(
      url,
      JSON.stringify(data),
      {observe: 'response'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  openTill(tellerId, id): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}tills/${id}/open?tellerId=${tellerId}`,
      null,
      {observe: 'response'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  closeTill(tellerId, id): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}tills/${id}/close?tellerId=${tellerId}`,
      null,
      {observe: 'response'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getTillBalance(id, date) {
    return this.httpClient.get<any[]>(
      `${environment.API_ENDPOINT}tills/${id}/balance?datetime=${date}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

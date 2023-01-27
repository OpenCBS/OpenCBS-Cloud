import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { ExchangeRateState } from './exchange-rate.reducer';
import { environment } from '../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';

@Injectable()
export class ExchangeRateService {

  constructor(private store$: Store<ExchangeRateState>,
              private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getExchangeRate(params): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}exchange-rates`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  updateExchangeRate(): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}exchange-rates`,
      null)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

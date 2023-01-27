import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IPaymentGatewayState } from './payment-gateway.reducer';
import { environment } from '../../../../../environments/environment';
import { catchError, delay } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';

@Injectable()
export class PaymentGatewayService {

  constructor(private store$: Store<IPaymentGatewayState>,
              private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getPaymentGateway(params): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}payment-gateway`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }

  updateLoanList(data): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}payment-gateway/export`,
      data,
      {
        responseType: 'blob'
      })
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }
}

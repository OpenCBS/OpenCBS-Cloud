import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TermDepositProductListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getTermDepositProductList(params?: Object): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}term-deposit-products`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

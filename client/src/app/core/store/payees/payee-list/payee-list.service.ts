import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class PayeeListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getPayeeList(params?: Object): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}payees`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getCurrentAccountPayee() {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}accounting/payee?page=0`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

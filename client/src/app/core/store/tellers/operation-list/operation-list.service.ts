import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpClientHeadersService } from '../../../services';

@Injectable()
export class OperationListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getOperationList(tillId, currencyId = '', params?: Object): Observable<any> {
    const queryParams = Object.assign({currencyId: currencyId}, params);

    return this.httpClient.get(
      `${environment.API_ENDPOINT}tills/${tillId}/operations`,
      {params: this.httpClientHeadersService.buildQueryParams(queryParams)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

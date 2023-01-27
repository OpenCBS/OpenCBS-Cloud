import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpClientHeadersService } from '../../../services';

@Injectable()
export class BorrowingProductListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getBorrowingProductList(params?: Object): Observable<any> {
    const queryParams = Object.assign({sort: 'id,asc'}, params);

    return this.httpClient.get(
      `${environment.API_ENDPOINT}borrowing-products`,
      {params: this.httpClientHeadersService.buildQueryParams(queryParams)}).pipe(delay(environment.RESPONSE_DELAY));
  }
}

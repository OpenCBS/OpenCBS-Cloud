import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SavingProductListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getSavingProductList(params?: Object): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}saving-products`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));

  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MakerCheckerListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getMakerCheckerList(params?: Object): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}requests`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

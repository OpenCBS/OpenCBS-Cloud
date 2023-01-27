import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BranchListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getBranchList(params?: Object): Observable<any> {
    const queryParams = Object.assign({sort: 'id,asc'}, params);

    return this.httpClient.get(
      `${environment.API_ENDPOINT}branches`,
      {params: this.httpClientHeadersService.buildQueryParams(queryParams)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

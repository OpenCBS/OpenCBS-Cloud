import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpClientHeadersService } from '../../../services';

@Injectable()
export class PenaltiesService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getPenalties(params?: Object): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}penalties`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

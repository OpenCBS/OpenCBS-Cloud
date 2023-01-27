import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TermDepositProfileListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getProfileTermDepositList(params?: Object): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}term-deposits/by-profile/${params['profileId']}`,
      {params: this.httpClientHeadersService.buildQueryParams(params['queryObject'])})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

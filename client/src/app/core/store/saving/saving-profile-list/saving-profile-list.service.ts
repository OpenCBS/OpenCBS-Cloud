import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SavingProfileListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getSavingProfileList(params?: Object): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}savings/by-profile/${params['profileId']}`,
      {params: this.httpClientHeadersService.buildQueryParams(params['queryObject'])})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

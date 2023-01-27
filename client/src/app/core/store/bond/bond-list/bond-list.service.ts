import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class BondListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getBondList(params?: Object): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}bonds`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getProfileBondList(profileId: number) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}bonds/by-profile/${profileId}`);
  }
}

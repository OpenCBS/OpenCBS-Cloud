import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanApplicationListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getLoanApplicationList(params?: Object) {
    let url = params && params['sortType']
      ? `${environment.API_ENDPOINT}loan-applications/sorted`
      : `${environment.API_ENDPOINT}loan-applications`;
    return this.httpClient.get<any[]>(
      url,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getProfileLoanApplicationList(profileId: number) {
    return this.httpClient.get<any[]>(
      `${environment.API_ENDPOINT}loan-applications/by-profile/${profileId}`);
  }
}

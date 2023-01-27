import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CreditLineService {

  constructor(private httpClient: HttpClient) {
  }

  getCreditLine(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}credit-lines/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getProfileCreditLineList(profileId: number) {
    return this.httpClient.get<any[]>(
      `${environment.API_ENDPOINT}credit-lines/by-profile/${profileId}`);
  }
}

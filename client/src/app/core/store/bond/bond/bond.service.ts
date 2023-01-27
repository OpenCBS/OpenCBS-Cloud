import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { HttpClientHeadersService } from '../../../services';

@Injectable()
export class BondService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  public getBond(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}bonds/${id}`,
      {headers: this.httpClientHeadersService.getHeaders()})
      .pipe(delay(environment.RESPONSE_DELAY));
  }


  public startBond(bonId) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}bonds/start/${bonId}`,
      null,
      {headers: this.httpClientHeadersService.getHeaders()})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

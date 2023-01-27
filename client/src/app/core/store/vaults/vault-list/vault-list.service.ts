import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VaultListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getVaultList(params?: Object): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}vaults`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

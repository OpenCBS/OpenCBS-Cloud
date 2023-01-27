import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CurrentAccountsListService {

  constructor(private httpClient: HttpClient) {
  }

  getCurrentAccountsList(profileId, type): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}profiles/${type}/${profileId}/accounts`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

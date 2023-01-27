import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserListService {

  constructor(private httpClient: HttpClient) {
  }

  getUserList(params): Observable<any> {
    let showAll = false;
    if (params && params['showAll']) {
      showAll = true
    }

    return this.httpClient.get(
      `${environment.API_ENDPOINT}users?show_all=${showAll}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

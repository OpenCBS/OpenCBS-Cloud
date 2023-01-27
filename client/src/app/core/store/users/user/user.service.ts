import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  getUser(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}users/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

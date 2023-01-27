import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RoleService {

  constructor(
    private httpClient: HttpClient) {
  }

  getRole(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}roles/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

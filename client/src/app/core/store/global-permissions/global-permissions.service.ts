import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class GlobalPermissionsService {

  constructor(
    private httpClient: HttpClient) {
  }

  getGlobalPermissions() {
    return this.httpClient.get(`${environment.API_ENDPOINT}permissions`);
  }
}

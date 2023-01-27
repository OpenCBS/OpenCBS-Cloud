import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LocationCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createLocation(location) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}locations`,
      JSON.stringify(location))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

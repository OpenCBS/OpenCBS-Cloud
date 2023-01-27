import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LocationUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateLocation(location, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}locations/${id}`,
      JSON.stringify(location))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

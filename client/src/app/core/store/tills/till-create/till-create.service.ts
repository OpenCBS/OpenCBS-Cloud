import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TillCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createTill(till) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}tills`,
      JSON.stringify(till)).pipe(delay(environment.RESPONSE_DELAY));
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TillUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateTill(till, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}tills/${id}`,
      JSON.stringify(till))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

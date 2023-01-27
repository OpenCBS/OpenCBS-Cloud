import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class BondUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateBond(id, data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}bonds/${id}`,
      JSON.stringify(data))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

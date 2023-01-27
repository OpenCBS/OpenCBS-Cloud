import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class BondCreateService {
  constructor(
    private httpClient: HttpClient) {
  }

  addBond(bond) {
    return this.httpClient
      .post(`${environment.API_ENDPOINT}bonds`, JSON.stringify(bond))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TermDepositCreateService {

  constructor(private httpClient: HttpClient) {
  }

  addTermDeposit(term_deposit) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}term-deposits`,
      JSON.stringify(term_deposit))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

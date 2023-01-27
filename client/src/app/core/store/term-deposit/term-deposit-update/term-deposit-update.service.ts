import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TermDepositUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateTermDeposit(id, data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}term-deposits/${id}`,
      JSON.stringify(data))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

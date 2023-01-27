import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class BankAccountListService {

  constructor(private httpClient: HttpClient) {
  }

  getBankAccounts(tag: any) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}accounting/lookup/by-tags`,
      JSON.stringify(tag))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

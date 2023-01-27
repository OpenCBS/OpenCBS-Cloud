import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChartOfAccountCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createChartOfAccount(chartOfAccounts) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}accounting/chart-of-accounts`,
      JSON.stringify(chartOfAccounts))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

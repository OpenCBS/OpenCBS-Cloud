import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChartOfAccountUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateChartOfAccount(chartOfAccount, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}accounting/chart-of-accounts/${id}`,
      JSON.stringify(chartOfAccount)).pipe(delay(environment.RESPONSE_DELAY));
  }
}

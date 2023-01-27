import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChartOfAccountsService {
  constructor(private httpClient: HttpClient) {
  }

  getChartOfAccounts() {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}accounting/chart-of-accounts/root`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getChartOfAccountsByBranchId(id) {
    return this.httpClient.get<any[]>(
      `${environment.API_ENDPOINT}accounting/chart-of-accounts/root/branch?branch=${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getChartOfAccountsForEdit(id) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}accounting/chart-of-accounts/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

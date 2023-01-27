import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TermDepositAccountTransactionsService {

  constructor(private httpClient: HttpClient) {
  }

  getTermDepositAccountTransactions(params): Observable<any> {
    const queryParams = `?from=${params['period']['start']}&to=${params['period']['end']}&size=30`;
    const endPoint = `${environment.API_ENDPOINT}accounting/accounts/${params.id}/operations${queryParams}`;
    const url = params.query ? `${endPoint}&page=${params.query.page}` : endPoint;
    return this.httpClient.get(url).pipe(delay(environment.RESPONSE_DELAY));
  }
}

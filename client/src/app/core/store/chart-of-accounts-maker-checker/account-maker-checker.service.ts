import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountMakerCheckerService {

  constructor(
    private httpClient: HttpClient) {
  }

  getAccountMakerChecker(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}requests/${id}/content`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  public approveMakerChecker(id): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}requests/${id}/approve`,
      null,
      {responseType: 'text'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  public deleteMakerChecker(id): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}requests/${id}/delete`,
      null,
      {responseType: 'text'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

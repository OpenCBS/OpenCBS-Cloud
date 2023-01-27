import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileMakerCheckerService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanAppMakerChecker(id) {
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

  public rejectMakerChecker(id): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}requests/${id}/delete`,
      null,
      {responseType: 'text'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

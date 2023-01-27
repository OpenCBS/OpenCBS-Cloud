import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanDashboardService {

  constructor(private httpClient: HttpClient) {
  }

  getHtmlFile(parameters) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}reports/${parameters.reportName}`,
      JSON.stringify(parameters),
      {
        responseType: 'text'
      }).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(() => {
        const errMessage = 'No data was found with the specified parameters';
        return observableOf({err: errMessage});
      }));
  }
}

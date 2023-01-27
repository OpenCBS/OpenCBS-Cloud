import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ReportService {
  constructor(
    private httpClient: HttpClient) {
  }

  getReportList() {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}reports?point=REPORTS`).pipe(delay(environment.RESPONSE_DELAY));
  }

  getFileExcel(parameters) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}reports/excel`,
      JSON.stringify(parameters),
      {
        responseType: 'blob'
      }).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(() => {
        const errMessage = 'No data was found with the specified parameters';
        return observableOf({err: errMessage});
      }));
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

  getFileReport(parameters) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}reports/${parameters.reportName}`,
      JSON.stringify(parameters),
      {
        responseType: 'blob'
      }).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(() => {
        const errMessage = 'No data was found with the specified parameters';
        return observableOf({err: errMessage});
      }));
  }
}

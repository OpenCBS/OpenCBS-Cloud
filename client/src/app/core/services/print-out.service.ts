import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

@Injectable()
export class PrintOutService {

  constructor(private httpClient: HttpClient) {
  }

  getForms(formType): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}printing-forms?point=${formType}`).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(err => {
        return observableOf({err: err.error})
      }));
  }

  getExcelForms(page): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}reports?point=${page}`).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(err => {
        return observableOf({err: err.error})
      }));
  }

  downloadForm(formData, formType): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}printing-forms?point=${formType}`,
      JSON.stringify(formData),
      {responseType: 'blob' as 'json'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const reader = new FileReader();
          reader.readAsText(err.error);
          return fromEvent(reader, 'loadend').pipe(
            map(() => {
              return JSON.parse(reader.result as string);
            }));
        }));
  }

  downloadMicrosoftDocForm(formData, formType): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}printing-forms/${formType}`,
      JSON.stringify(formData),
      {responseType: 'blob' as 'json'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const reader = new FileReader();
          reader.readAsText(err.error);
          return fromEvent(reader, 'loadend').pipe(
            map(() => {
              return JSON.parse(reader.result as string);
            }));
        }));
  }

  downloadExcelForm(formData): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}reports/excel`,
      JSON.stringify(formData),
      {responseType: 'blob'}).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(() => {
        const errMessage = 'Oops, something wrong';
        return observableOf({err: errMessage});
      }));
  }
}

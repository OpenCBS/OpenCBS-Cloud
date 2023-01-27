import { Observable, of as observableOf, Subject } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RollbackService {
  private rollBackSource = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {
  }

  fireRollback() {
    this.rollBackSource.next(true);
  }

  getRollbackStatus() {
    return this.rollBackSource.asObservable();
  }

  // getHeaders() {
  //   const token = window.localStorage.getItem('token');
  //   return this.setHeaders(token);
  // }

  rollBack(loanId: number, data: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}loans/${loanId}/roll-back`,
      JSON.stringify(data))
      .pipe(catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
    // const url = `${environment.API_ENDPOINT}loans/${loanId}/roll-back`;
    // return this.http.post(
    //   url, JSON.stringify(data),
    //   {headers: this.getHeaders()}).pipe(
    //   map((res: Response) => {
    //     return res;
    //   }),
    //   catchError((err: Response) => {
    //     const response = err.json();
    //     const errObj = {
    //       error: true,
    //       message: response.message ? response.message : 'Error rolling back'
    //     };
    //     return observableOf(errObj);
    //   }));
  }
}

import { Observable, of as observableOf, Subject } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class BorrowingRollbackService {
  private rollBackSource = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {
  }

  fireRollback() {
    this.rollBackSource.next(true);
  }

  getRollbackStatus() {
    return this.rollBackSource.asObservable();
  }

  borrowingRollBack(borrowingId: number, comment: any): Observable<any> {
    const url = `${environment.API_ENDPOINT}borrowings/${borrowingId}/roll-back`;
    return this.httpClient.post(url, JSON.stringify(comment)).pipe(
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message ? err.error.message : 'Error rolling back'
        };
        return observableOf(errObj);
      }));
  }
}

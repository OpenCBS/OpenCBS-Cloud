import { Observable, of as observableOf, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BondRollbackService {
  private rollBackSource = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {
  }

  fireRollback() {
    this.rollBackSource.next(true);
  }

  getRollbackStatus() {
    return this.rollBackSource.asObservable();
  }

  bondRollBack(bondId: number, comment: any): Observable<any> {
    const url = `${environment.API_ENDPOINT}bonds/${bondId}/roll-back`;
    return this.httpClient.post(url,
      JSON.stringify(comment),
      {responseType: 'text' as 'json'})
      .pipe(catchError((err: HttpErrorResponse) => {
        const resp = JSON.parse(err.error);
        const errObj = {
          error: true,
          message: resp.message
        };
        return observableOf(errObj);
      }));
  }
}

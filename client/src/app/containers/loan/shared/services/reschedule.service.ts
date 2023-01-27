import { of as observableOf } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RescheduleService {

  constructor(private httpClient: HttpClient) {
  }

  reschedule(loanId: number, data: Object, type) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}loans/${loanId}/reschedule/${type}`,
      data)
      .pipe(catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }
}

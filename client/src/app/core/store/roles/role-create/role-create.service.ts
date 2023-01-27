import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RoleCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createRole(role) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}roles`,
      JSON.stringify(role)).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }
}

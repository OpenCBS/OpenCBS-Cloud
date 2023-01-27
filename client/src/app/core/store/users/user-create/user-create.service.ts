import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createUser(user) {
    const url = `${environment.API_ENDPOINT}users`;

    return this.httpClient.post<any>(url,
      JSON.stringify(user))
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }
}

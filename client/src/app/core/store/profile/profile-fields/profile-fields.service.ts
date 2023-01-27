import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/internal/observable/of';

@Injectable()
export class ProfileFieldsService {

  constructor(private httpClient: HttpClient) {
  }

  getProfileFieldsMeta(type: string): Observable<any> {
    const url = `profiles/${type}/custom-field-sections`;
    return this.httpClient.get(`${environment.API_ENDPOINT}${url}`);
  }

  getLookupType() {
    return this.httpClient.get(`${environment.API_ENDPOINT}lookup-type`)
      .pipe(catchError((err) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }),
        delay(environment.RESPONSE_DELAY));
  }
}

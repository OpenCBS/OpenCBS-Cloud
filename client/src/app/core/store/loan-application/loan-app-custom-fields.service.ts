import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// Todo(Chyngyz): Rewrite to redux implementation

@Injectable()
export class LoanAppCustomFieldsService {

  constructor(private httpClient: HttpClient) {
  }

  getCustomFields(loanAppId) {
    return this.httpClient.get<any>(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/custom-field-values`);
  }

  updateCustomFields(loanAppId, data) {
    const url = `${environment.API_ENDPOINT}loan-applications/${loanAppId}/custom-field-values`;

    return this.httpClient.put<any>(url, data)
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

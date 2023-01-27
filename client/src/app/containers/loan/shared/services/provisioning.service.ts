import { catchError, delay, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of as observableOf } from 'rxjs/internal/observable/of';

@Injectable()
export class ProvisioningService {

  constructor(private httpClient: HttpClient) {
  }

  public getProvisioning(loanId, provisionType) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loans/${loanId}/specific-provision/${provisionType}`
    );
  }

  public getCalculateSpecificProvision(loanId, value, provisionType, isRate) {
    const typeValue = isRate ? 'by-percent' : 'by-amount';
    const url = `${environment.API_ENDPOINT}loans/${loanId}/recalculate-specific-provision/${value}/${provisionType}/${typeValue}`;
    return this.httpClient.get(url)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError(err => observableOf(err.error)));
  }

  createSpecificProvision(data) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loans/apply-specific-provision`,
      JSON.stringify(data),
      {responseType: 'blob' as 'json'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const reader = new FileReader();
          reader.readAsText(err.error);  // read that message
          return fromEvent(reader, 'loadend').pipe(
            map(() => {
              return JSON.parse(reader.result.toString());
            }));
        }));
  }
}

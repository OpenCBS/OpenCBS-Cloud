import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';

@Injectable()
export class WriteOffService {

  constructor(private httpClient: HttpClient) {
  }

  writeOff(loanId: number, data: any): Observable<any> {
    const url = `${environment.API_ENDPOINT}loans/${loanId}/write-off`;
    return this.httpClient.post(url, JSON.stringify(data), {observe: 'response'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          return observableOf(err.error);
        }));
  }

  calculateWriteOffValue(loanId: number, value: any): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loans/${loanId}/write-off/calculate`,
      value
    );
  }
}

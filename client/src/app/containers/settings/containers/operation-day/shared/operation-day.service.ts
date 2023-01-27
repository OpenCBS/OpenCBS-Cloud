import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable()
export class OperationDayService {
  constructor(private httpClient: HttpClient) {
  }

  public dayClosure(dateTime): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}day-closure?date=${dateTime}`,
      null);
  }
}

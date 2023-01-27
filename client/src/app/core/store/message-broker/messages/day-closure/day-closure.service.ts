import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { DayClosure } from './day-closure.model';

@Injectable({providedIn: 'root'})
export class DayClosureService {
  constructor(private httpClient: HttpClient) {
  }

  public checkStatus(): Observable<DayClosure> {
    return this.httpClient.get<DayClosure>(
      `${environment.API_ENDPOINT}day-closure/status`)
  }
}

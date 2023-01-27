import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RabbitConfig } from './message.models';

@Injectable({providedIn: 'root'})
export class RabbitService {
  constructor(private httpClient: HttpClient) {
  }

  public getRabbitConfig(): Observable<RabbitConfig> {
    return this.httpClient.get<RabbitConfig>(
      `${environment.API_ENDPOINT}configurations/rabbit-credential`);
  }

  public getCurrentUser(): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}users/current`);
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileEventsListService {

  constructor(private httpClient: HttpClient) {
  }

  getProfileEventsList(profileId): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}task-events/by-profile/${profileId}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

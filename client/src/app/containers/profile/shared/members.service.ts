import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MembersService {
  constructor(private httpClient: HttpClient) {
  }

  addMember(profileId, profileType, memberId): Observable<any> {
    const url = `${environment.API_ENDPOINT}profiles/${profileType}/${profileId}/members/add/${memberId}`;
    return this.httpClient.post(
      url,
      null).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(err => {
        return observableOf(err);
      }));
  }

  getMembersList(profileId: number, profileType: string) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}profiles/${profileType}/${profileId}`);
  }

  removeMember(profileId, profileType, memberId): Observable<any> {
    const url = `${environment.API_ENDPOINT}profiles/${profileType}/${profileId}/members/remove/${memberId}`;
    return this.httpClient.post(
      url,
      null).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(err => {
        return observableOf(err);
      }));
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileChangeService {

  constructor(private httpClient: HttpClient) {
  }

  getProfileChanges({data}): Observable<any> {
    let url;
    if ( data.type === 'people' || data.type === 'companies' || data.type === 'groups' ) {
      url = `profiles/${data.type}/${data.profileId}/changes`;
    } else {
      throw new Error('Unsupported profile type is provided.');
    }
    return this.httpClient.get(
      `${environment.API_ENDPOINT}${url}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createProfile(profileData, type: string): Observable<any> {
    let url: string;
    if (type === 'people' || type === 'companies' || type === 'groups') {
      url = `profiles/${type}`;
    }
    return this.httpClient.post(
      `${environment.API_ENDPOINT}${url}`,
      JSON.stringify(profileData))
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

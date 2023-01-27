import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateProfile(profileData, type: string, id: number): Observable<any> {
    let url;
    if (type === 'people' || type === 'companies' || type === 'groups') {
      url = `profiles/${type}/${id}`;
    } else {
      return null;
    }
    return this.httpClient.put(
      `${environment.API_ENDPOINT}${url}`,
      JSON.stringify(profileData))
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

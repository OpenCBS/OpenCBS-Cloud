import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileStateService {

  constructor(private httpClient: HttpClient) {
  }

  getProfileInfo(id: number, type: string): Observable<any> {
    let url;
    if ( type === 'people' || type === 'companies' || type === 'groups' ) {
      url = `profiles/${type}/${id}`;
    } else {
      throw new Error('Unsupported profile type is provided.');
    }
    return this.httpClient.get(`${environment.API_ENDPOINT}${url}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  createCurrentAccount(id, type, currencyId) {
    let url;
    if ( type === 'people' || type === 'companies' ) {
      url = `profiles/${type}/${id}/account?currencyId=${currencyId}`;
    } else {
      throw new Error('Unsupported profile type is provided.');
    }

    return this.httpClient.post(
      `${environment.API_ENDPOINT}${url}`,
      JSON.stringify(status))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

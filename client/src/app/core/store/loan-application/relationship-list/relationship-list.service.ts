import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RelationshipListService {

  constructor(private httpClient: HttpClient) {
  }

  getRelationshipList(params?: Object): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}relationships`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

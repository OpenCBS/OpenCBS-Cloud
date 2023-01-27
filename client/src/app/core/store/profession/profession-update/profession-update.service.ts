import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfessionUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateProfession(profession, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}professions/${id}`,
      JSON.stringify(profession))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

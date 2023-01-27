import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfessionCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createProfession(profession) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}professions`,
      JSON.stringify(profession))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

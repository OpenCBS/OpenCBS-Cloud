import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SavingUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateSaving(id, data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}savings/${id}`,
      JSON.stringify(data))
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

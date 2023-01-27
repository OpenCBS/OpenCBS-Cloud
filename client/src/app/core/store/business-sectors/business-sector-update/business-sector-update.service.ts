import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BusinessSectorUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateBusinessSector(businessSector, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}business-sectors/${id}`,
      JSON.stringify(businessSector))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BusinessSectorCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createBusinessSector(businessSector) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}business-sectors`,
      JSON.stringify(businessSector)).pipe(delay(environment.RESPONSE_DELAY));
  }
}

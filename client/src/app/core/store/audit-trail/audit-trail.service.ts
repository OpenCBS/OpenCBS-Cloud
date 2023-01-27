import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../services';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuditTrailService {

  constructor(
    private httpClient: HttpClient,
    private httpClientHeadersService: HttpClientHeadersService) {
  }

  getAuditTrail(reportType, params): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}audit-trail/report/${reportType}`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

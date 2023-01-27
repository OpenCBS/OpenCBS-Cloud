import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClientHeadersService } from '../../../../services';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class IntegrationWithBankExportService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getIntegrationWithBankExport(params): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}sepa/integration/export/generate-for-date`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  exportIntegrationWithBankExport(date, data: any) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}sepa/integration/export/export-xml`,
      JSON.stringify(data),
      {
        params: this.httpClientHeadersService.buildQueryParams(date),
        responseType: 'blob'
      }).pipe(delay(environment.RESPONSE_DELAY));
  }
}

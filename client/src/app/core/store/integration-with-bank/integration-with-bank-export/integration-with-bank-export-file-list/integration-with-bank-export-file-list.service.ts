import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../../services';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class IntegrationWithBankExportFileListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getIntegrationWithBankExportFileList(params): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}sepa/integration/export/file-list`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

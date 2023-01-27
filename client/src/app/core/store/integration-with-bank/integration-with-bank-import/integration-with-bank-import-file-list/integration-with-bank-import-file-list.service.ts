import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../../services';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class IntegrationWithBankImportFileListService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  getIntegrationWithBankImportFileList(params): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}sepa/integration/import/file-list`,
      {params: this.httpClientHeadersService.buildQueryParams(params)})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

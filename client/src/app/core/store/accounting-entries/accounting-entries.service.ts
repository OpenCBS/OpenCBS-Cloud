import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../services';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountingEntriesService {
  constructor(
    private httpClient: HttpClient,
    private httpClientHeadersService: HttpClientHeadersService) {
  }

  getAccountingEntries(params): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}accounting/entries`,
      {params: this.httpClientHeadersService.buildQueryParams(params)});
  }
}

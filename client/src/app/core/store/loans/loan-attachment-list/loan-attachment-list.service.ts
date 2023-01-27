import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAttachmentListService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanAttachmentList(loanId): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loans/${loanId}/attachments`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

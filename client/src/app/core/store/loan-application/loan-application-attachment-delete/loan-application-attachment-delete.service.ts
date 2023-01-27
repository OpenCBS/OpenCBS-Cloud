import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanApplicationAttachmentDelService {

  constructor(private httpClient: HttpClient) {
  }

  deleteLoanApplicationAttachment(fileId, loanAppId: number): Observable<any> {
    const url = `loan-applications/${loanAppId}/attachments/${fileId}`;

    return this.httpClient.delete(
      `${environment.API_ENDPOINT}${url}`).pipe(delay(environment.RESPONSE_DELAY));
  }

}

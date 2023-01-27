import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAttachmentDelService {

  constructor(private httpClient: HttpClient) {
  }

  deleteLoanAttachment(fileId, loanId: number): Observable<any> {
    const url = `${environment.API_ENDPOINT}loans/${loanId}/attachments/${fileId}`;
    return this.httpClient.delete(url).pipe(delay(environment.RESPONSE_DELAY));
  }
}

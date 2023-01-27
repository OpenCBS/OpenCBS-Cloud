import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ProfileAttachmentListService {

  constructor(private httpClient: HttpClient) {
  }

  getProfileAttachmentList(profileType, profileId): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}profiles/${profileType}/${profileId}/attachments`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  pinProfileAttachment(profileType, profileId, attachmentId): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}profiles/${profileType}/${profileId}/attachments/${attachmentId}/pin`,
      null);
  }

  unpinProfileAttachment(profileType, profileId, attachmentId): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}profiles/${profileType}/${profileId}/attachments/${attachmentId}/unpin`,
      null);
  }
}

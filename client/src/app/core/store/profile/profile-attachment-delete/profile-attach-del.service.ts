import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileAttachmentDelService {

  constructor(private httpClient: HttpClient) {
  }

  deleteProfileAttachment(fileId, profileType: string, profileId: number): Observable<any> {
    let url;
    if (profileType === 'people' || profileType === 'companies' || profileType === 'groups') {
      url = `profiles/${profileType}/${profileId}/attachments/${fileId}`;
    } else {
      return null;
    }
    return this.httpClient.delete(`${environment.API_ENDPOINT}${url}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}

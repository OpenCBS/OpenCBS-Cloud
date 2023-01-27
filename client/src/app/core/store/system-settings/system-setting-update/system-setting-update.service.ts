import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SystemSettingUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateSystemSetting(systemSettingData): Observable<any> {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}system-settings`,
      JSON.stringify(systemSettingData))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

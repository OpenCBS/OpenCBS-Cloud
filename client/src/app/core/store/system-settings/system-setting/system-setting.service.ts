import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SystemSettingService {

  constructor(private httpClient: HttpClient) {
  }

  getSystemSetting() {
    return this.httpClient.get(`${environment.API_ENDPOINT}system-settings`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";

@Injectable()
export class LocalStorageService {

  getDateFormat() {
    return localStorage.getItem('dateFormat') === 'undefined' ? environment.DATE_FORMAT_MOMENT : localStorage.getItem('dateFormat');
  }
}

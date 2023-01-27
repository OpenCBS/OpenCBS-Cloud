import { Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CommonService {
  private data: any;

  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService) {
  }

  getVersion(): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}info`)
      .pipe(catchError(err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        return Observable.of(err.error);
      }));
  }

  public setData(data) {
    this.data = data;
  }

  public getData() {
    let temp = this.data;
    return temp;
  }
}

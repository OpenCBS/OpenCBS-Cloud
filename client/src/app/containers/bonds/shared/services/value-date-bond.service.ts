
import {of as observableOf,  Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ValueDateBondService {
  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService) {
  }

  valueDateBond(BondId, date) {
    return this.httpClient.post(`${environment.API_ENDPOINT}bonds/${BondId}/valueDate?date=${date}`,
      null)
      .pipe(catchError(err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        return observableOf(err.error);
      }));
  }
}

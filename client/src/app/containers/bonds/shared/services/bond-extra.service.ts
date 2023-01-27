
import {of as observableOf,  Observable, Subject } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class BondFormExtraService {
  private formStatusSource = new Subject<boolean>();
  private bondStateSource = new Subject<any>();
  private showDeletedEventsSource = new Subject<any>();
  private showSystemEventsSource = new Subject<any>();
  formStatusSourceChanged$ = this.formStatusSource.asObservable();
  bondStateSourceChange$ = this.bondStateSource.asObservable();
  showDeletedEventsSourceChange$ = this.showDeletedEventsSource.asObservable();
  showSystemEventsSourceChange$ = this.showSystemEventsSource.asObservable();

  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService) {
  }

  announceFormStatusChange(bool: boolean) {
    this.formStatusSource.next(bool);
  }

  announceShowDeletedEventsStatusChange(bool: boolean) {
    this.showDeletedEventsSource.next(bool);
  }

  announceShowSystemEventsStatusChange(bool: boolean) {
    this.showSystemEventsSource.next(bool);
  }

  setState(data) {
    this.bondStateSource.next(data);
  }

  public getAmounts(numberOfBonds: number, equivalentCurrencyId: number, valueDate: string) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}bonds/convert-amount?quantity=${numberOfBonds}&currency=${equivalentCurrencyId}&date=${valueDate}`)
      .pipe(catchError(err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        return observableOf(err.error);
      }));
  }

  getExpireDate(data: any) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}bonds/expire-date`, JSON.stringify(data))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

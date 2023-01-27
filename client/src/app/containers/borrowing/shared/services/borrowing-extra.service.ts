import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingFormExtraService {
  private formStatusSource = new Subject<boolean>();
  private borrowingStateSource = new Subject<any>();
  private showDeletedEventsSource = new Subject<any>();
  private showSystemEventsSource = new Subject<any>();
  formStatusSourceChanged$ = this.formStatusSource.asObservable();
  borrowingStateSourceChange$ = this.borrowingStateSource.asObservable();
  showDeletedEventsSourceChange$ = this.showDeletedEventsSource.asObservable();
  showSystemEventsSourceChange$ = this.showSystemEventsSource.asObservable();

  constructor(private httpClient: HttpClient) {
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
    this.borrowingStateSource.next(data);
  }

  getFirstMaturityDate(scheduleType) {
    return this.httpClient.get(`${environment.API_ENDPOINT}schedule-first-maturity-dates?scheduleType=${scheduleType}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

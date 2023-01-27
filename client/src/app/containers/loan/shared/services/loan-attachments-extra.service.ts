import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoanAttachmentsExtraService {
  private showDeletedEventsSource = new Subject<any>();
  private showSystemEventsSource = new Subject<any>();
  showDeletedEventsSourceChange$ = this.showDeletedEventsSource.asObservable();
  showSystemEventsSourceChange$ = this.showSystemEventsSource.asObservable();

  announceShowDeletedEventsStatusChange(bool: boolean) {
    this.showDeletedEventsSource.next(bool);
  }

  announceShowSystemEventsStatusChange(bool: boolean) {
    this.showSystemEventsSource.next(bool);
  }
}

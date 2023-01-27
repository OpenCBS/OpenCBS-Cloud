import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoanAttachmentsExtraService {
  private loanAttachmentModalStatus = new Subject<boolean>();
  private showSystemEventsSource = new Subject<any>();
  showSystemEventsSourceChange$ = this.showSystemEventsSource.asObservable();

  changeLoanAttachmentModalVisibility(bool: boolean) {
    this.loanAttachmentModalStatus.next(bool);
  }

  announceShowSystemEventsStatusChange(bool: boolean) {
    this.showSystemEventsSource.next(bool);
  }
}

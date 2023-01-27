// Temp solution
declare var newrelic: { noticeError(error: any): void; };

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ErrorLogService {
  private errorSource = new Subject<any>();

  errorOccurred$ = this.errorSource.asObservable();

  constructor() {
  }

  // ---
  // PUBLIC METHODS.
  // ---

  public logError(error: any): void {

    this.sendToConsole(error);

    this.announceError(error);

    this.sendToNewRelic(error);
  }


  // ---
  // PRIVATE METHODS.
  // ---

  private sendToConsole(error: any): void {

    if ( console && console.group && console.error ) {
      console.group('Error Log Service');
      console.error(error);
      console.error(error.message);
      console.error(error.stack);
      console.groupEnd();
    }
  }

  private announceError(err): void {
    this.errorSource.next(err);
  }

  private sendToNewRelic(error: any): void {
    // Read more: https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-apis/report-data-events-browser-agent-api
    // newrelic.noticeError( error );
  }

}

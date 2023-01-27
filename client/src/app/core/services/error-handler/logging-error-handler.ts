import { ErrorHandler } from '@angular/core';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';


import { ErrorLogService } from './error-log.service';

export interface LoggingErrorHandlerOptions {
  rethrowError: boolean;
  unwrapError: boolean;
}

export let LOGGING_ERROR_HANDLER_OPTIONS: LoggingErrorHandlerOptions = {
  rethrowError: false,
  unwrapError: false
};


@Injectable()
export class LoggingErrorHandler implements ErrorHandler {

  constructor(
    private errorLogService: ErrorLogService,
    @Inject(LOGGING_ERROR_HANDLER_OPTIONS) private options: LoggingErrorHandlerOptions) {
  }


  // ---
  // PUBLIC METHODS.
  // ---


  public handleError(error: any): void {

    try {
      console.group('ErrorHandler');
      console.error(error.message);
      console.error(error.stack);
      console.groupEnd();
    } catch (handlingError) {
      console.group('ErrorHandler');
      console.warn('Error when trying to output error.');
      console.error(handlingError);
      console.groupEnd();
    }

    try {
      this.options.unwrapError
        ? this.errorLogService.logError(this.findOriginalError(error))
        : this.errorLogService.logError(error);
    } catch (loggingError) {
      console.group('ErrorHandler');
      console.warn('Error when trying to log error to', this.errorLogService);
      console.error(loggingError);
      console.groupEnd();
    }

    if (this.options.rethrowError) {
      throw(error);
    }

  }


  // ---
  // PRIVATE METHODS.
  // ---


  private findOriginalError(error: any): any {
    while (error && error.originalError) {
      error = error.originalError;
    }
    return (error);
  }

}


export let LOGGING_ERROR_HANDLER_PROVIDERS = [
  {
    provide: LOGGING_ERROR_HANDLER_OPTIONS,
    useValue: LOGGING_ERROR_HANDLER_OPTIONS
  },
  {
    provide: ErrorHandler,
    useClass: LoggingErrorHandler
  }
];

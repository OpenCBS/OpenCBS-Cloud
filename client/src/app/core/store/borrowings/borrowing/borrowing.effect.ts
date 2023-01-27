import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as borrowingActions from './borrowing.actions';
import { NgRxAction } from '../../action.interface';
import { BorrowingService } from './borrowing.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class BorrowingEffects {

  @Effect()
  get_borrowing$ = this.actions$
    .pipe(ofType(borrowingActions.LOAD_BORROWING),
      switchMap((action: NgRxAction) => {
        return this.borrowingService.getBorrowing(action.payload).pipe(
          map(res => new borrowingActions.LoadBorrowingSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new borrowingActions.LoadBorrowingFailure(err.error);
            return observableOf(errObj);
          }));
      }));


  @Effect()
  disburse_borrowing$ = this.actions$
    .pipe(ofType(borrowingActions.DISBURSE_BORROWING),
      switchMap((action: NgRxAction) => {
        return this.borrowingService.disburseBorrowing(action.payload).pipe(
          map(() => {
            this.translate.get('SUCCESS_DISBURSED')
              .subscribe((response: string) => {
                this.toastrService.success(response, '', environment.SUCCESS_TOAST_CONFIG);
              });
            return new borrowingActions.LoadBorrowing(action.payload);
          }),
          catchError(err => {
            const errObj = new borrowingActions.LoadBorrowingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private borrowingService: BorrowingService,
              private actions$: Actions,
              public toastrService: ToastrService,
              private translate: TranslateService) {
  }
}

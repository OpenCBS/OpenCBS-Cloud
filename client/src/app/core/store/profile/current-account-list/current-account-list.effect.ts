import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as currentAccountListActions from './current-account-list.actions';
import { NgRxAction } from '../../action.interface';
import { CurrentAccountsListService } from './current-account-list.service';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CurrentAccountsListEffects {

  @Effect()
  get_profiles$ = this.actions$
    .pipe(ofType(currentAccountListActions.LOAD_CURRENT_ACCOUNTS),
      switchMap((action: NgRxAction) => {
        return this.currentAccountService.getCurrentAccountsList(action.payload.profileId, action.payload.type).pipe(
          map(res => {
            return new currentAccountListActions.LoadCurrentAccountsSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new currentAccountListActions.LoadCurrentAccountsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private currentAccountService: CurrentAccountsListService,
              private actions$: Actions) {
  }
}

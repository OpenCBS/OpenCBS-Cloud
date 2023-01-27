import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { TellerListService } from './teller-list.service';
import * as tellerListActions from './teller-list.actions';


@Injectable()
export class TellerListEffect {

  @Effect()
  get_teller_list$ = this.actions$
    .pipe(ofType(tellerListActions.LOAD_TELLERS),
      switchMap(() => {
        return this.tellerListService.getTellerList().pipe(
          map(res => new tellerListActions.LoadTellerListSuccess(res)),
          catchError(err => {
            const errObj = new tellerListActions.LoadTellerListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private tellerListService: TellerListService,
    private actions$: Actions) {
  }
}

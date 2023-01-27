import { of as observableOf, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import * as bondUpdateActions from './bond-update.actions';
import { BondUpdateService } from './bond-update.service';
import { NgRxAction } from '../../action.interface';

@Injectable()
export class BondUpdateEffects {

  @Effect()
  update_bond$ = this.actions$
    .pipe(ofType(bondUpdateActions.UPDATE_BOND),
  switchMap((action: NgRxAction) => {
    return this.bondUpdateService.updateBond(action.payload.id, action.payload.data)
    .pipe(map(res => {
        return new bondUpdateActions.UpdateBondSuccess(res);
      }),
      catchError((response): Observable<NgRxAction> => {
        const errObj = new bondUpdateActions.UpdateBondFailure(response.error);
        return observableOf(errObj);
      }));
  }));

  constructor(private bondUpdateService: BondUpdateService,
              private actions$: Actions) {
  }
}

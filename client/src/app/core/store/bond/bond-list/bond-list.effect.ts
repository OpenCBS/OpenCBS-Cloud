import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as bondListActions from './bond-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { BondListService } from './bond-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class BondListEffects {
  @Effect()
  load_bond$: Observable<Action> = this.actions$
    .pipe(ofType(bondListActions.LOAD_BONDS),
    switchMap((action: NgRxAction) => {
      return this.bondListService.getBondList(action.payload)
        .pipe(map(
          res => {
            return new bondListActions.LoadBondsSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new bondListActions.LoadBondsFailure(err.error);
            return observableOf(errObj);
          }));
    }));

  constructor(private bondListService: BondListService,
              private actions$: Actions) {
  }
}

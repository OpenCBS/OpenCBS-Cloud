import { of as observableOf, Observable } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';


import * as bondCreateActions from './bond-create.actions';
import { NgRxAction } from '../../action.interface';
import { BondCreateService } from './bond-create.service';

@Injectable()
export class BondCreateEffect {
  @Effect()
  create_bond$ = this.actions$
    .pipe(ofType(bondCreateActions.CREATE_BOND),
    switchMap((action: NgRxAction) => {
      return this.bondCreateService.addBond(action.payload)
        .pipe(map(res => {
          return new bondCreateActions.CreateBondSuccess(res);
        }),
          catchError((res): Observable<Action> => {
            const errObj = new bondCreateActions.CreateBondFailure(res.error);
            return observableOf(errObj);
          }));
    }));

  constructor(private bondCreateService: BondCreateService,
    private actions$: Actions) {

  }
}

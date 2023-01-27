import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import * as bondScheduleActions from './bond-schedule.actions'
import { NgRxAction } from '../../action.interface';
import { BondScheduleService } from './bond-schedule.service';


@Injectable()
export class BondScheduleEffects {

  @Effect()
  get_bond_schedule$ = this.actions$
    .pipe(ofType(bondScheduleActions.LOAD_BOND_SCHEDULE),
  switchMap((action: NgRxAction) => {
    return this.bondScheduleService.getBondSchedule(action.payload)
    .pipe(map(res => {
        return new bondScheduleActions.LoadBondScheduleSuccess(res);
      }),
      catchError(res => {
        const errObj = new bondScheduleActions.LoadBondScheduleFailure(res.error);
        return observableOf(errObj);
      }));
  }));

  @Effect()
  get_active_bond_schedule$ = this.actions$
    .pipe(ofType(bondScheduleActions.LOAD_ACTIVE_BOND_SCHEDULE),
  switchMap((action: NgRxAction) => {
    return this.bondScheduleService.getActiveBondSchedule(action.payload)
    .pipe(map(res => {
        return new bondScheduleActions.LoadBondScheduleSuccess(res);
      }),
      catchError(res => {
        const errObj = new bondScheduleActions.LoadBondScheduleFailure(res.error);
        return observableOf(errObj);
      }));
  }));

  constructor(private bondScheduleService: BondScheduleService,
              private actions$: Actions) {
  }
}

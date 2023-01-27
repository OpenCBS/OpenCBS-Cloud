import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import { BondEventsService } from './bond-events.service';
import * as bondEventActions from './bond-events.actions'
import { catchError, map, switchMap } from 'rxjs/operators';
import { NgRxAction } from '../../action.interface';
import { Action } from '@ngrx/store';

@Injectable()
export class BondEventsEffects {

  @Effect()
  load_bond_events$ = this.actions$
    .pipe(ofType(bondEventActions.LOAD_BOND_EVENTS),
    switchMap((action: NgRxAction) => {
      return this.bondEventsService.getBondEvents(action.payload.id, action.payload.status)
        .pipe(map(res => {
            return new bondEventActions.BondEventsSuccess(res);
          }),
          catchError((res): Observable<Action> => {
            const errObj = new bondEventActions.BondEventsFailure(res.error);
            return observableOf(errObj);
          }));
    }));

  constructor(private bondEventsService: BondEventsService,
              private actions$: Actions) {
  }
}

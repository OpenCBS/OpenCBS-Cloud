import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';


import { PenaltyUpdateService } from './penalty-update.service';
import * as penaltyUpdateActions from './penalty-update.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class PenaltyUpdateEffects {

  @Effect()
  update_penalty$ = this.actions$
    .pipe(ofType(penaltyUpdateActions.UPDATE_PENALTY),
      switchMap((action: NgRxAction) => {
        return this.penaltyUpdateService.updatePenalty(action.payload.data, action.payload.penaltyId).pipe(
          map(
            res => {
              return new penaltyUpdateActions.UpdatePenaltySuccess();
            }
          ),
          catchError((err): Observable<Action> => {
            const errObj = new penaltyUpdateActions.UpdatePenaltyFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private penaltyUpdateService: PenaltyUpdateService,
              private actions$: Actions) {
  }
}

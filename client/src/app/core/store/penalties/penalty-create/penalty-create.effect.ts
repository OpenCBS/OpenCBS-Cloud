import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';


import { PenaltyCreateService } from './penalty-create.service';
import * as penaltyCreateActions from './penalty-create.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class PenaltyCreateEffects {

  @Effect()
  create_penalty$ = this.actions$
    .pipe(ofType(penaltyCreateActions.CREATE_PENALTY),
      switchMap((action: NgRxAction) => {
        return this.penaltyCreateService.createPenalty(action.payload).pipe(
          map(
            res => {
              return new penaltyCreateActions.CreatePenaltySuccess();
            }
          ),
          catchError((err): Observable<Action> => {
            const errObj = new penaltyCreateActions.CreatePenaltyFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private penaltyCreateService: PenaltyCreateService,
              private actions$: Actions) {
  }
}

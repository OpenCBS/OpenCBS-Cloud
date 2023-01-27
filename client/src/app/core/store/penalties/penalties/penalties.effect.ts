import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as penaltiesActions from './penalties.actions';
import { PenaltiesService } from './penalties.service';
import { Action } from '@ngrx/store';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class PenaltiesEffects {

  @Effect()
  load_penalties$: Observable<Action> = this.actions$
    .pipe(ofType(penaltiesActions.LOAD_PENALTIES),
      switchMap((action) => {
        return this.penaltiesService.getPenalties().pipe(
          map(
            res => {
              return new penaltiesActions.LoadPenaltiesSuccess(res);
            }
          ),
          catchError((err): Observable<Action> => {
            const errObj = new penaltiesActions.LoadPenaltiesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private penaltiesService: PenaltiesService,
    private actions$: Actions) {
  }
}

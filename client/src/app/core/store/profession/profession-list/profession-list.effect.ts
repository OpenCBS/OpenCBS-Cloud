import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as professionListActions from './profession-list.actions';
import { ProfessionListService } from './profession-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ProfessionListEffects {

  @Effect()
  load_professions$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(professionListActions.LOAD_PROFESSIONS),
      switchMap((action) => {
        return this.professionListService.getProfessionList().pipe(
          map(
            res => new professionListActions.LoadProfessionsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new professionListActions.LoadProfessionsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private professionListService: ProfessionListService,
    private actions$: Actions) {
  }
}

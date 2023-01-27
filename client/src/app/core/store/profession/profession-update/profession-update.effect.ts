import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { ProfessionUpdateService } from './profession-update.service';
import * as professionUpdateActions from './profession-update.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ProfessionUpdateEffects {

  @Effect()
  update_profession$ = this.actions$
    .pipe(ofType(professionUpdateActions.UPDATE_PROFESSION),
      switchMap((action: professionUpdateActions.ProfessionUpdateActions) => {
        return this.professionUpdateService.updateProfession(action.payload.data, action.payload.fieldId).pipe(
          map(
            res => new professionUpdateActions.UpdateProfessionSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new professionUpdateActions.UpdateProfessionFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private professionUpdateService: ProfessionUpdateService,
    private actions$: Actions) {
  }
}

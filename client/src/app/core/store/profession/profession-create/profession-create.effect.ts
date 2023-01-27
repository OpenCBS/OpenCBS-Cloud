import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { ProfessionCreateService } from './profession-create.service';
import * as professionCreateActions from './profession-create.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ProfessionCreateEffects {

  @Effect()
  create_profession$ = this.actions$
    .pipe(ofType(professionCreateActions.CREATE_PROFESSION),
      switchMap((action: professionCreateActions.ProfessionCreateActions) => {
        return this.professionCreateService.createProfession(action.payload).pipe(
          map(
            res => new professionCreateActions.CreateProfessionSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new professionCreateActions.CreateProfessionFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private professionCreateService: ProfessionCreateService,
    private actions$: Actions) {
  }
}

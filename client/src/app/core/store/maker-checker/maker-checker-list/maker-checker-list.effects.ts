import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { MakerCheckerListService } from './maker-checker-list.service';
import * as makerCheckerListActions from './maker-checker-list.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class MakerCheckerListEffects {

  @Effect()
  get_loan_product_list$ = this.actions$
    .pipe(ofType(makerCheckerListActions.LOAD_MAKER_CHECKERS),
      switchMap((action: NgRxAction) => {
        return this.makerCheckerListService.getMakerCheckerList(action.payload)
          .pipe(
            map(res => new makerCheckerListActions.LoadMakerCheckerListSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new makerCheckerListActions.LoadMakerCheckerListFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(
    private makerCheckerListService: MakerCheckerListService,
    private actions$: Actions) {
  }
}

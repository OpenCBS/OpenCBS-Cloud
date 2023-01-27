import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import * as bondActions from './bond.actions';
import { NgRxAction } from '../../action.interface';
import { BondService } from './bond.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class BondEffects {

  @Effect()
  get_bond$ = this.actions$
    .pipe(ofType(bondActions.LOAD_BOND),
    switchMap((action: NgRxAction) => {
    return this.bondService.getBond(action.payload)
    .pipe(map(res => {
        return new bondActions.LoadBondSuccess(res);
      }),
      catchError(res => {
        const errObj = new bondActions.LoadBondFailure(res.error);
        return observableOf(errObj);
      }));
  }));

  @Effect()
  start_bond$ = this.actions$
    .pipe(ofType(bondActions.START_BOND),
    switchMap((action: NgRxAction) => {
      return this.bondService.startBond(action.payload)
        .pipe(map(res => {
            this.translate.get('SUCCESS_SOLD')
              .subscribe((response: string) => {
                this.toastrService.success(
                  response,
                  '',
                  environment.SUCCESS_TOAST_CONFIG
                );
              });
            return new bondActions.LoadBondSuccess(res);
          }),
          catchError(res => {
            const errObj = new bondActions.LoadBondFailure(res.error);
            return observableOf(errObj);
          }));
    }));

  constructor(private bondService: BondService,
              private actions$: Actions,
              public toastrService: ToastrService,
              private translate: TranslateService) {
  }
}

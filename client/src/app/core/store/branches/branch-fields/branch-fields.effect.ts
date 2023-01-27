import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { BranchFieldsService } from './branch-fields.service';
import * as branchActions from './branch-fields.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class BranchFieldsEffects {

  @Effect()
  get_branch_fields_meta$ = this.actions$
    .pipe(ofType(branchActions.LOAD_BRANCH_FIELDS_META),
      switchMap((action: NgRxAction) => {
        return this.branchFieldsService.getBranchFieldsMeta().pipe(
          map(
            res => new branchActions.LoadBranchFieldsMetaSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new branchActions.LoadBranchFieldsMetaFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private branchFieldsService: BranchFieldsService,
              private actions$: Actions) {
  }
}

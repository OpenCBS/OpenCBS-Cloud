import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as relationshipListActions from './relationship-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { RelationshipListService } from './relationship-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RelationshipListEffects {
  @Effect()
  load_relationships$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(relationshipListActions.LOAD_RELATIONSHIPS),
      switchMap((action: NgRxAction) => {
        return this.relationshipListService.getRelationshipList(action.payload).pipe(
          map(
            res => {
              return new relationshipListActions.LoadRelationshipsSuccess(res);
            }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new relationshipListActions.LoadRelationshipsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private relationshipListService: RelationshipListService,
              private actions$: Actions) {
  }
}

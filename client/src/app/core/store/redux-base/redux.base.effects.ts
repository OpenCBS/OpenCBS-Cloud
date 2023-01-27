import { of as observableOf, Observable } from 'rxjs';

import { switchMap, map, catchError } from 'rxjs/operators';
import {Actions, ofType} from '@ngrx/effects';


import { ReduxBaseActions } from './redux.base.actions';
import { NgRxAction } from '../action.interface';

export class ReduxBaseEffects {

  static getConfig(actions$: Actions, baseActions: ReduxBaseActions, method) {
    return actions$
      .pipe(ofType(baseActions.getInitialActionName()),
      switchMap((action) => {
        return method(action).pipe(
          map(
            res => {
              return baseActions.fireSuccessAction(res);
            }
          ),
          catchError((err): Observable<NgRxAction> => {
            const errObj = baseActions.fireFailureAction(err.error);
            return observableOf(errObj);
          }));
      }));
  }
}

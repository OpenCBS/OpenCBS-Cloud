import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as locationListActions from './location-list.actions';
import { LocationListService } from './location-list.service';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LocationListEffects {

  @Effect()
  load_locations$: Observable<Action> = this.actions$
    .pipe(ofType(locationListActions.LOAD_LOCATIONS),
      switchMap((action) => {
        return this.locationListService.getLocationList().pipe(
          map(
            res => new locationListActions.LoadLocationsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new locationListActions.LoadLocationsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private locationListService: LocationListService,
    private actions$: Actions) {
  }
}

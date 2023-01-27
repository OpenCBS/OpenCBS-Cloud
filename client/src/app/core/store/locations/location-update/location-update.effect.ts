import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { LocationUpdateService } from './location-update.service';
import * as locationUpdateActions from './location-update.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LocationUpdateEffects {

  @Effect()
  update_location$ = this.actions$
    .pipe(ofType(locationUpdateActions.UPDATE_LOCATION),
      switchMap((action: locationUpdateActions.LocationUpdateActions) => {
        return this.locationUpdateService.updateLocation(action.payload.editData, action.payload.fieldId).pipe(
          map(
            res => new locationUpdateActions.UpdateLocationSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new locationUpdateActions.UpdateLocationFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private locationUpdateService: LocationUpdateService,
    private actions$: Actions) {
  }
}

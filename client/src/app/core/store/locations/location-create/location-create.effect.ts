import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { LocationCreateService } from './location-create.service';
import * as locationCreateActions from './location-create.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LocationCreateEffects {

  @Effect()
  create_location$ = this.actions$
    .pipe(ofType(locationCreateActions.CREATE_LOCATION),
      switchMap((action: locationCreateActions.LocationCreateActions) => {
        return this.locationCreateService.createLocation(action.payload).pipe(
          map(res => new locationCreateActions.CreateLocationSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new locationCreateActions.CreateLocationFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private locationCreateService: LocationCreateService,
    private actions$: Actions) {
  }
}

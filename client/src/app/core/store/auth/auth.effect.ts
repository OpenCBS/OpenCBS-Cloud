import { of as observableOf } from 'rxjs';

import { ignoreElements, tap, map, catchError, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { RouteService } from './route.service';
import * as authActions from './auth.actions';
import { NOT_AUTHENTICATED } from './model/auth.model';
import * as currentUserActions from '../users/current-user';
import { AuthAppState } from './auth.reducer';
import { WindowRefService } from '../../services/window.service';
import { NgRxAction } from '../action.interface';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../message-broker/message.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthEffects {
  private _window: Window;

  @Effect()
  login$ = this.actions$.pipe(ofType(authActions.AUTHENTICATE),
    switchMap((action: authActions.AuthActions) => {
      this.authService.dispatchUserLoading();
      return this.authService.login(action.payload).pipe(
        map((res: any) => {
          if ( res.errorCode && res.errorCode === 'invalid_credentials' && res.httpStatus ) {
            return new currentUserActions.LoadCurrentUserFailure(res.message);
          }
          this.authService.checkAsAuthenticated();
          return new authActions.SaveToken(res.data);
        }),
        catchError(err => {
          const errMessage = err.status === 401 ? 'Invalid username or password' : err.error.message;
          this.toastrService.error(errMessage, '', environment.ERROR_TOAST_CONFIG);
          this.store$.dispatch(new authActions.PurgeAuth());
          return observableOf(new currentUserActions.LoadCurrentUserFailure(errMessage));
        }));
    })
  );

  @Effect()
  check_auth$ = this.actions$.pipe(ofType(authActions.CHECK_AUTH),
    map((action: NgRxAction) => {
      const token = this._window.localStorage.getItem('token');
      if ( token ) {
        return new authActions.SaveToken(token);
      }
      return new authActions.PurgeAuth();
    }));

  @Effect()
  save_token$ = this.actions$
    .pipe(ofType(authActions.SAVE_TOKEN),
    map((action: NgRxAction) => {
      // TODO: add validation rules for token
      if ( action.payload ) {
        this._window.localStorage.setItem('token', action.payload);
        return new currentUserActions.LoadCurrentUser();
      }
      return new authActions.PurgeAuth();
    }));

  @Effect()
  purge_auth$ = this.actions$.pipe(ofType(authActions.PURGE_AUTHENTICATE),
    map((action: NgRxAction) => {
      this._window.localStorage.clear();
      this.messageService.unsubscribeMq();
      this.authService.checkAsUnauthenticated();
      return new authActions.SetAuth(NOT_AUTHENTICATED);
    }));

  @Effect()
  navigateHome$ = this.actions$.pipe(ofType(authActions.LOGIN_SUCCEEDED),
    tap(() => {
      this.authService.checkAsAuthenticated();
      this.messageService.init();
      const redirectUrl = this.routeService.getRedirectUrl();
      if ( redirectUrl ) {
        this.router.navigateByUrl(redirectUrl);
      } else if ( this._window.location.hash.match(/(login)/i) ) {
        this.router.navigateByUrl('/dashboard');
      }
    }),
    ignoreElements());

  constructor(private store$: Store<AuthAppState>,
              private router: Router,
              private routeService: RouteService,
              private authService: AuthService,
              private actions$: Actions,
              private windowRef: WindowRefService,
              private toastrService: ToastrService,
              private messageService: MessageService) {
    this._window = windowRef.nativeWindow;
  }
}

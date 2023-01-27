import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { UserListService } from './user-list.service';
import * as userListActions from './user-list.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class UserListEffect {

  @Effect()
  get_user_list$ = this.actions$
    .pipe(ofType(userListActions.LOAD_USERS),
      switchMap((action: userListActions.LoadUserList) => {
        return this.userListService.getUserList(action.payload).pipe(
          map(res => new userListActions.LoadUserListSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new userListActions.LoadUserListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private userListService: UserListService,
    private actions$: Actions) {
  }
}

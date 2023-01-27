import { Action } from '@ngrx/store';

export interface Credentials {
  username: string;
  password: string;
}

export const AUTHENTICATE = '[AUTH] AUTHENTICATE';
export const PURGE_AUTHENTICATE = '[AUTH] PURGE_AUTHENTICATE';
export const CHECK_AUTH = '[AUTH] CHECK_AUTH';
export const SET_AUTH = '[AUTH] SET_AUTH';
export const SAVE_TOKEN = '[AUTH] SAVE_TOKEN';
export const LOGIN_SUCCEEDED = '[AUTH] LOGIN_SUCCEEDED';

export class Login implements Action {
  readonly type = AUTHENTICATE;

  constructor(public payload?: Credentials) {
  }
}

export class PurgeAuth implements Action {
  readonly type = PURGE_AUTHENTICATE;

  constructor(public payload?: Credentials) {
  }
}

export class CheckAuth implements Action {
  readonly type = CHECK_AUTH;

  constructor(public payload?: Credentials) {
  }
}

export class SetAuth implements Action {
  readonly type = SET_AUTH;

  constructor(public payload?: any) {
  }
}

export class SaveToken implements Action {
  readonly type = SAVE_TOKEN;

  constructor(public payload?: any) {
  }
}

export class LoginSucceeded implements Action {
  readonly type = LOGIN_SUCCEEDED;

  constructor(public payload?: Credentials) {
  }
}

export type AuthActions = Login | PurgeAuth | CheckAuth | SetAuth | SaveToken | LoginSucceeded;

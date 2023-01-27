import { Map } from 'immutable';
import { AuthRecord } from './model/auth.model';
import * as fromAuth from './auth.actions';

export type AuthState = Map<string, any>;

export interface AuthAppState {
}

const initialState: AuthState = new AuthRecord();


export function authReducer(state = initialState, action: fromAuth.AuthActions) {
  switch (action.type) {
    case fromAuth.SET_AUTH:
      return state.withMutations(currentUser => {
        currentUser
        .set('status', action.payload.status);
      });
    default:
      return state;
  }
}

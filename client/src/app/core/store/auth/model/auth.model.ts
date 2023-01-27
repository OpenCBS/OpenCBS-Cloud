/**
 * Created by Chyngyz on 1/16/2017.
 */

import { Record } from 'immutable';

export const AUTHENTICATED = 'is_authenticated';
export const NOT_AUTHENTICATED = 'not_authenticated';

export const AuthRecord = Record({
  status: NOT_AUTHENTICATED
});

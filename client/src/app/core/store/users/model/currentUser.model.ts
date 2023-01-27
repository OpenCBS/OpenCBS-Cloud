import { Map, Record } from 'immutable';

import { Role } from '../../roles/model/role.model';
import { Branch } from '../../branches/model/branch.model';

export const DEFAULT_USERNAME = '';

export interface CurrentUser extends Map<string, any> {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  branch: any;
  error: boolean;
  errorMessage: string;
  loading: boolean;
}

export const UserRecord = Record({
  id: null,
  username: DEFAULT_USERNAME,
  firstName: '',
  lastName: '',
  role: '',
  permissions: [],
  branch: null,
  error: false,
  errorMessage: '',
  loading: false
});

export function createUser(user: CurrentUser): CurrentUser {
  return new UserRecord(user) as CurrentUser;
}


export interface UserListElement {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  branch: Branch;
}

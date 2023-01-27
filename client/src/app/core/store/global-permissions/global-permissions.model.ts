import { Map, Record } from 'immutable';


export interface GlobalPermissions extends Map<string, any> {
  permissions: string[];
  error: boolean;
  errorMessage: string;
  loaded: boolean;
  success: boolean;
}

export const GlobalPermissionsRecord = Record({
  permissions: [],
  error: false,
  errorMessage: '',
  loaded: false,
  success: false
});

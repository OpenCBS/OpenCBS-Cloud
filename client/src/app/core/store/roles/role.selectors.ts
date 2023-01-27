import { distinctUntilChanged, map } from 'rxjs/operators';

export const getRole = (id) => {
  return state => state
    .pipe(map(s => {
      let obj: Object = {};
      if ( s['roles'].length ) {
        s['roles'].map(role => {
          if ( role.id === id ) {
            obj = role;
          }
        });
      }
      return obj;
    }));
};

export const getRoles = () => {
  return state => state
    .pipe(map(s => {
      if ( s['appStates'].roles.roles.length ) {
        return s['appStates'].roles.roles;
      } else {
        return null;
      }
    }), distinctUntilChanged());
};

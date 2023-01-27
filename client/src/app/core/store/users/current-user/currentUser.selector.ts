import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';


export interface Selector<T, V> {
  (observable$: Observable<T>): Observable<V>;
}

export const getCurrentUserPermissions = () => {
  return state => state
    .pipe(map(s => s['permissions']), distinctUntilChanged());
};

export const GetCurrenUser = () => state => state.getCurrentUserState;

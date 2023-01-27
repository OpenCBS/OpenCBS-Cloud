import { map } from 'rxjs/operators';

export const getCurrentPage = () => {
  return state => state
    .pipe(map(s => s['currentPage']));
};

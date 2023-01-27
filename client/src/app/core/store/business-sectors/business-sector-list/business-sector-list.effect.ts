import { Injectable } from '@angular/core';
import { BusinessSectorListActions } from './business-sector-list.actions';
import { Actions, Effect } from '@ngrx/effects';
import { BusinessSectorListService } from './business-sector-list.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';
import { Observable } from 'rxjs';

@Injectable()
export class BusinessSectorListEffects {
  @Effect()
  load_business_sectors$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.businessSectorListActions, () => {
    return this.businessSectorListService.getBusinessSectorList();
  });

  constructor(private businessSectorListService: BusinessSectorListService,
              private businessSectorListActions: BusinessSectorListActions,
              private actions$: Actions) {
  }
}

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { BusinessSectorCreateActions } from './business-sector-create.actions';
import { BusinessSectorCreateService } from './business-sector-create.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';

@Injectable()
export class BusinessSectorCreateEffects {

  @Effect()
  create_business_sector$ = ReduxBaseEffects.getConfig(this.actions$, this.businessSectorCreateActions, (action) => {
    return this.businessSectorCreateService.createBusinessSector(action.payload.data);
  });

  constructor(private businessSectorCreateService: BusinessSectorCreateService,
              private businessSectorCreateActions: BusinessSectorCreateActions,
              private actions$: Actions) {
  }
}

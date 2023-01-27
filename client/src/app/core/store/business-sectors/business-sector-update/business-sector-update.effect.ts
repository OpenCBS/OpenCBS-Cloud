import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { BusinessSectorUpdateActions } from './business-sector-update.actions';
import { BusinessSectorUpdateService } from './business-sector-update.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';

@Injectable()
export class BusinessSectorUpdateEffects {

  @Effect()
  update_business_sector$ = ReduxBaseEffects.getConfig(this.actions$, this.businessSectorUpdateActions, (action) => {
    return this.businessSectorUpdateService.updateBusinessSector(action.payload.data.businessSectorEditData, action.payload.data.id);
  });

  constructor(private businessSectorUpdateService: BusinessSectorUpdateService,
              private businessSectorUpdateActions: BusinessSectorUpdateActions,
              private actions$: Actions) {
  }
}

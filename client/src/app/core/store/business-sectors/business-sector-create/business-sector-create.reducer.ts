import { BusinessSectorCreateActions } from './business-sector-create.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface ICreateBusinessSector extends IReduxBase {
}

export function businessSectorCreateReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [BusinessSectorCreateActions]).get(BusinessSectorCreateActions), state, {type, payload});
}


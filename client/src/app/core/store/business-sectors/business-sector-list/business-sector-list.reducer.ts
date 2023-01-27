import { BusinessSectorListActions } from './business-sector-list.actions';
import { ReduxBaseReducer, IReduxBase } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface IBusinessSectorList extends IReduxBase {
}

export function businessSectorListReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [BusinessSectorListActions]).get(BusinessSectorListActions), state, {type, payload});
}


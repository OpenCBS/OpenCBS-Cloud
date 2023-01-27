import { BorrowingEventsActions } from './borrowing-events.actions';
import { IReduxBase, ReduxBaseReducer } from '../../redux-base/redux.base.reducer';
import { ReflectiveInjector } from '@angular/core';
import { NgRxAction } from '../../action.interface';

export interface IBorrowingEvents extends IReduxBase {
}

export function borrowingEventsReducer(state, {type, payload}: NgRxAction) {
  return ReduxBaseReducer.getConfig(ReflectiveInjector.resolveAndCreate(
    [BorrowingEventsActions]).get(BorrowingEventsActions), state, {type, payload})
}



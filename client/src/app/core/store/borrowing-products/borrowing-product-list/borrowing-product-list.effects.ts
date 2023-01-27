import { Injectable } from '@angular/core';
import { BorrowingProductListActions } from './borrowing-product-list.actions';
import { Actions, Effect } from '@ngrx/effects';
import { BorrowingProductListService } from './borrowing-product-list.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';
import { Observable } from 'rxjs';

@Injectable()
export class BorrowingProductListEffects {
  @Effect()
  load_borrowing_product$: Observable<any> = ReduxBaseEffects
  .getConfig(this.actions$, this.borrowingProductListActions, (action) => {
    return this.borrowingProductListService.getBorrowingProductList(action.payload.data);
  });

  constructor(private borrowingProductListService: BorrowingProductListService,
              private borrowingProductListActions: BorrowingProductListActions,
              private actions$: Actions) {
  }
}

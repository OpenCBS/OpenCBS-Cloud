import { Injectable } from '@angular/core';
import { BorrowingProductInfoActions } from './borrowing-product-info.actions';
import { Actions, Effect } from '@ngrx/effects';
import { BorrowingProductInfoService } from './borrowing-product-info.service';
import { ReduxBaseEffects } from '../../redux-base/redux.base.effects';
import { Observable } from 'rxjs';

@Injectable()
export class BorrowingProductInfoEffects {
  @Effect()
  load_borrowing_product$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.borrowingProductInfoActions, (action) => {
    return this.borrowingProductInfoService.getBorrowingProductInfo(action.payload.data);
  });

  constructor(private borrowingProductInfoService: BorrowingProductInfoService,
              private borrowingProductInfoActions: BorrowingProductInfoActions,
              private actions$: Actions) {
  }
}

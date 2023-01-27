import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { BorrowingProductCreateActions } from './borrowing-product-create.actions';
import { BorrowingProductCreateService } from './borrowing-product-create.service';
import { ReduxBaseEffects } from '../../redux-base';

@Injectable()
export class BorrowingProductCreateEffects {

  @Effect()
  create_borrowing_product$ = ReduxBaseEffects.getConfig(this.actions$, this.borrowingProductCreateActions, (action) => {
    return this.borrowingProductCreateService.createBorrowingProduct(action.payload.data);
  });

  constructor(private borrowingProductCreateService: BorrowingProductCreateService,
              private borrowingProductCreateActions: BorrowingProductCreateActions,
              private actions$: Actions) {
  }
}

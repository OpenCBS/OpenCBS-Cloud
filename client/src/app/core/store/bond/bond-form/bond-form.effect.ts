import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as bondActions from './bond-form.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { BondProductService } from './bond-form.service';

@Injectable()
export class BondProductEffects {
  @Effect()
  load_bond$: Observable<Action> = this.actions$
  .pipe(ofType(bondActions.BOND_SET_PROFILE),
  switchMap(() => {
    return this.bondProductService.getDefaultBondProduct()
    .pipe(map(res => {
      return new bondActions.SetBondProduct({product: res});
    }));
  }));

  constructor(private bondProductService: BondProductService,
              private actions$: Actions) {
  }
}

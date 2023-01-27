import { AbstractHandler } from './abstract.handler';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DayClosureState } from '../messages/day-closure/index';
import * as fromStore from '../messages/index';

@Injectable({providedIn: 'root'})
export class DayClosureHandler extends AbstractHandler {
  private readonly TYPE = 'DAY_CLOSURE';

  constructor(private store$: Store<DayClosureState>) {
    super()
  }

  getType(): string {
    return this.TYPE;
  }

  handleMessage(message: any): void {
    this.store$.dispatch(new fromStore.SetDayClosure(message));
  }
}

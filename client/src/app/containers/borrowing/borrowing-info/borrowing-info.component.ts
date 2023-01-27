import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IBorrowingFormState } from '../../../core/store/borrowings';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { Router } from '@angular/router';
import { IBorrowingState } from '../../../core/store/borrowings/borrowing/borrowing.reducer';

@Component({
  selector: 'cbs-borrowing-info',
  templateUrl: 'borrowing-info.component.html',
  styleUrls: ['borrowing-info.component.scss']
})
export class BorrowingInfoComponent implements OnInit, OnDestroy {
  public borrowing: IBorrowingFormState;
  public breadcrumb = [];
  private borrowingFormSub: any;

  constructor(private borrowingFormStore$: Store<IBorrowingFormState>,
              private store$: Store<fromRoot.State>,
              private borrowingStore$: Store<IBorrowingState>,
              private router: Router) {
  }

  ngOnInit() {
    this.borrowingFormStore$.dispatch(new fromStore.SetStateBond('info'));
    this.borrowingFormSub = this.store$.select(fromRoot.getBorrowingFormState).subscribe(
      (borrowingState: IBorrowingFormState) => {
        if (borrowingState.loaded) {
          this.borrowing = borrowingState;
          const borrowingProfile = borrowingState['data']['profile'];
          const profileType = borrowingProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: borrowingProfile['name'],
              link: `/profiles/${profileType}/${borrowingProfile['id']}/info`
            },
            {
              name: 'BORROWINGS',
              link: `/profiles/${profileType}/${borrowingProfile['id']}/borrowings`
            },
            {
              name: 'INFO',
              link: ''
            }
          ];

        }
      });

    setTimeout(() => {
      this.borrowingStore$.dispatch(new fromStore.SetBorrowingBreadcrumb(this.breadcrumb));
    }, 1000)
  }

  ngOnDestroy() {
    this.borrowingFormSub.unsubscribe();
  }
}

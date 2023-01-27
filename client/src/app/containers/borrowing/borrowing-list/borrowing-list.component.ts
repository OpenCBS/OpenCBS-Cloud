import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  IBorrowingList,
  IBorrowingState,
  IBorrowingFormState
} from '../../../core/store/borrowings';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cbs-borrowing-list',
  templateUrl: 'borrowing-list.component.html',
  styleUrls: ['borrowing-list.component.scss']
})

export class BorrowingListComponent implements OnInit, OnDestroy {
  public borrowingData: Observable<IBorrowingList>;
  public svgData = {
    collection: 'custom',
    class: 'custom42',
    name: 'custom42'
  };
  public searchQuery = '';
  public queryObject = {
    search: '',
    page: 1
  };
  private paramsSub: any;
  private currentPageSub: any;

  constructor(private borrowingListStore$: Store<IBorrowingList>,
              private borrowingStore$: Store<IBorrowingState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private borrowingFormStore$: Store<IBorrowingFormState>) {
  }

  ngOnInit() {
    this.borrowingFormStore$.dispatch(new fromStore.FormResetLL());
    this.borrowingStore$.dispatch(new fromStore.ResetBorrowing());
    this.borrowingData = this.store$.select(fromRoot.getBorrowingListState);
    this.currentPageSub = this.borrowingData.pipe((this.getCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? query['page'] : 1;

      this.searchQuery = query['search'] ? query['search'] : '';
      if (this.queryObject.page !== 1 && this.searchQuery.search) {
        this.borrowingListStore$.dispatch(new fromStore.LoadBorrowings(this.queryObject));
      } else {
        this.borrowingListStore$.dispatch(new fromStore.LoadBorrowings());
      }
    });
  }

  getCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  clearSearch() {
    this.search();
  }

  search(query?) {
    this.queryObject.search = query || '';
    this.queryObject.page = 1;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject.search ? this.queryObject : {}
    };
    this.router.navigate(['/borrowings'], navigationExtras);
  }

  goToBorrowing(borrowing: any) {
    this.router.navigate(['/borrowings', borrowing.data.id, 'info']);
  }

  goToNextPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/borrowings'], navigationExtras);
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ITermDepositList } from '../../../core/store/term-deposit/term-deposit-list';
import { ITermDepositState } from '../../../core/store/term-deposit/term-deposit';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cbs-term-deposit-list',
  templateUrl: 'term-deposit-list.component.html',
  styleUrls: ['term-deposit-list.component.scss']
})

export class TermDepositListComponent implements OnInit, OnDestroy {
  public termDepositData: Observable<ITermDepositList>;
  public svgData = {
    collection: 'custom',
    class: 'custom17',
    name: 'custom17'
  };
  public searchQuery = '';
  public queryObject = {
    search: '',
    page: 1
  };

  private paramsSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private termDepositListStore$: Store<ITermDepositList>,
              private termDepositStore$: Store<ITermDepositState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.termDepositStore$.dispatch(new fromStore.ResetTermDeposit());
    this.termDepositData = this.store$.select(fromRoot.getTermDepositListState);
    this.currentPageSub = this.termDepositData.pipe((this.getCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? query['page'] : 1;

      this.searchQuery = query['search'] ? query['search'] : '';
      if (this.queryObject.page !== 1 && this.searchQuery.search) {
        this.termDepositListStore$.dispatch(new fromStore.LoadTermDeposits(this.queryObject));
      } else {
        this.termDepositListStore$.dispatch(new fromStore.LoadTermDeposits());
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
    this.router.navigate(['/term-deposits'], navigationExtras);
  }

  goToTermDeposit(termDeposit: any) {
    this.router.navigate(['/term-deposits', termDeposit.data.id, 'info']);
  }

  goToNextPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/term-deposits'], navigationExtras);
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { IMakerCheckerList } from '../../../core/store/maker-checker';
import { CurrentUserAppState } from '../../../core/store';
import { map } from 'rxjs/operators';

const SVG_DATA = {
  collection: 'standard',
  class: 'task2',
  name: 'task2'
};

@Component({
  selector: 'cbs-maker-checkers',
  templateUrl: 'maker-checker-list.component.html',
  styleUrls: ['maker-checker-list.component.scss']
})

export class MakerCheckerListComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public makerCheckersData: any;
  public searchQuery = '';
  public queryObject = {
    search: '',
    page: 1
  };
  public makerChecker: any;

  private currentPageSub: any;
  private paramsSub: any;
  private makerCheckersSub: any;
  private makerCheckerId: any;

  constructor(private makerCheckerListStore: Store<IMakerCheckerList>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private userStore$: Store<CurrentUserAppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.makerCheckersSub = this.store$.pipe(select(fromRoot.getMakerCheckerListState))
      .subscribe((makerCheckerState: IMakerCheckerList) => {
        if ( makerCheckerState.loaded && makerCheckerState.success && !makerCheckerState.error ) {
          this.makerChecker = makerCheckerState.makerCheckers;
        }
      });

    this.makerCheckersData = this.store$.pipe(select(fromRoot.getMakerCheckerListState));
    this.currentPageSub = this.makerCheckersData.pipe(this.getMakerCheckersCurrentPage()).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? query['page'] : 1;

      this.searchQuery = query['search'] ? query['search'] : '';
      if ( this.queryObject.page !== 1 && this.searchQuery.search ) {
        this.makerCheckerListStore.dispatch(new fromStore.LoadMakerCheckerList(this.queryObject));
      } else {
        this.makerCheckerListStore.dispatch(new fromStore.LoadMakerCheckerList());
      }
    });
  }

  getMakerCheckersCurrentPage = () => {
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

    this.router.navigate(['/requests'], navigationExtras);
  }

  goToMakerChecker(makerChecker: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'maker-checker'
      }
    };
    this.makerCheckerId = makerChecker.data.id;
    if ( makerChecker.data.type === 'ROLE_CREATE' || makerChecker.data.type === 'ROLE_EDIT' ) {
      this.router.navigate(['/roles', this.makerCheckerId, 'maker-checker'], navigationExtras)
    } else if ( makerChecker.data.type === 'USER_CREATE' || makerChecker.data.type === 'USER_EDIT' ) {
      this.router.navigate(['/users', this.makerCheckerId, 'maker-checker'], navigationExtras)
    } else if ( makerChecker.data.type === 'LOAN_PRODUCT_CREATE' || makerChecker.data.type === 'LOAN_PRODUCT_EDIT' ) {
      this.router.navigate(['/loan-products', this.makerCheckerId, 'maker-checker'], navigationExtras)
    } else if ( makerChecker.data.type === 'SAVING_PRODUCT_CREATE' || makerChecker.data.type === 'SAVING_PRODUCT_EDIT' ) {
      this.router.navigate(['/saving-products', this.makerCheckerId, 'maker-checker'], navigationExtras)
    } else if ( makerChecker.data.type === 'TERM_DEPOSIT_PRODUCT_CREATE' || makerChecker.data.type === 'TERM_DEPOSIT_PRODUCT_EDIT' ) {
      this.router.navigate(['/term-deposit-products', this.makerCheckerId, 'maker-checker'], navigationExtras)
    } else if ( makerChecker.data.type === 'ACCOUNT_CREATE' || makerChecker.data.type === 'ACCOUNT_EDIT' ) {
      this.router.navigate(['/accounting/maker-checker', this.makerCheckerId])
    } else if ( makerChecker.data.type === 'LOAN_DISBURSEMENT' ) {
      this.router.navigate(['/loan-app-maker-checker', this.makerCheckerId, 'maker-checker'])
    } else if ( makerChecker.data.type === 'LOAN_ROLLBACK' ) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'maker-checker-rollback'
        }
      };
      this.router.navigate(['/loans-maker-checker', this.makerCheckerId, 'maker-checker-rollback'], navigationExtras)
    } else if ( makerChecker.data.type === 'LOAN_REPAYMENT' ) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'maker-checker-repayment'
        }
      };
      this.router.navigate(['/loans-maker-checker', this.makerCheckerId, 'maker-checker-repayment'], navigationExtras)
    } else if ( makerChecker.data.type === 'PEOPLE_CREATE' || makerChecker.data.type === 'PEOPLE_EDIT' ) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'people'
        }
      };
      this.router.navigate(['/profile-maker-checker', this.makerCheckerId], navigationExtras)
    } else if ( makerChecker.data.type === 'COMPANY_CREATE' || makerChecker.data.type === 'COMPANY_EDIT' ) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'company'
        }
      };
      this.router.navigate(['/profile-maker-checker', this.makerCheckerId], navigationExtras)
    } else if ( makerChecker.data.type === 'GROUP_CREATE' || makerChecker.data.type === 'GROUP_EDIT' ) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'group'
        }
      };
      this.router.navigate(['/profile-maker-checker', this.makerCheckerId], navigationExtras)
    }
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/requests'], navigationExtras);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.makerCheckersSub.unsubscribe();
    this.currentPageSub.unsubscribe();
  }
}

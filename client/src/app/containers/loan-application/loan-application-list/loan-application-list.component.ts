import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ILoanAppFormState, ILoanAppList, ILoanAppState } from '../../../core/store/loan-application';
import { getCurrentPage } from '../../../core/store/loan-application/loan-application.selectors';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-application-list',
  templateUrl: 'loan-application-list.component.html',
  styleUrls: ['loan-application-list.component.scss']
})
export class LoanApplicationListComponent implements OnInit, OnDestroy {
  public loanApplicationData: Observable<ILoanAppList>;
  public svgData = SVG_DATA;
  public searchQuery = '';
  public cols: any[];
  public colName: string;
  public click = false;
  public sortDirection = 1;
  public queryObject = {
    search: '',
    page: 1,
    sortType: '',
    isAsc: false
  };

  private paramsSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private loanApplicationListStore$: Store<ILoanAppList>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private loanAppFormStore$: Store<ILoanAppFormState>) {
    this.loanApplicationData = this.store$.pipe(select(fromRoot.getLoanApplicationListState));
  }

  ngOnInit() {
    this.cols = [
      {field: 'PROFILE', header: 'PROFILE'},
      {field: 'PROFILE_TYPE', header: 'PROFILE_TYPE'},
      {field: 'CONTRACT_CODE', header: 'LOAN_APPLICATION_CODE'},
      {field: 'AMOUNT', header: 'AMOUNT'},
      {field: 'INTEREST_RATE', header: 'INTEREST_RATE'},
      {field: 'PRODUCT_NAME', header: 'LOAN_PRODUCT_NAME'},
      {field: 'CREATED_AT', header: 'CREATED_AT'},
      {field: 'BRANCH_NAME', header: 'BRANCH_NAME'},
      {field: 'STATUS', header: 'STATUS'},
    ];
    this.loanAppFormStore$.dispatch(new fromStore.FormReset());
    this.loanApplicationStore$.dispatch(new fromStore.ResetLoanApplication());

    this.currentPageSub = this.loanApplicationData.pipe((getCurrentPage()))
      .subscribe((page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {
          page: page + 1
        });
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? query['page'] : 1;

      this.searchQuery = query['search'] ? query['search'] : '';
      if ( this.queryObject.page !== 1 && this.searchQuery.search ) {
        this.loanApplicationListStore$.dispatch(new fromStore.LoadLoanApplications(this.queryObject));
      } else {
        this.loanApplicationListStore$.dispatch(new fromStore.LoadLoanApplications());
      }
    });
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }

  sortValue(value) {
    this.click = true;
    this.colName = value;
    this.queryObject = {
      ...this.queryObject,
      isAsc: !this.queryObject.isAsc
    };

    if ( value ) {
      this.queryObject.sortType = value;
      this.loanApplicationListStore$.dispatch(new fromStore.LoadLoanApplications(this.queryObject));
    }
  }

  getClassName() {
    if ( this.click ) {
      return {
        colName: this.colName,
        className: 'selected'
      };
    }
  }

  clearSearch() {
    this.search();
  }

  search(query?) {
    this.queryObject = Object.assign({}, this.queryObject, {search: query || '', page: 1});

    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject.search ? this.queryObject : {}
    };

    this.router.navigate(['/loan-applications'], navigationExtras);
  }

  gotoPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/loan-applications'], navigationExtras);
  }

  goToApplication(loanApp: any) {
    this.router.navigate(['/loan-applications', loanApp.id, 'info']);
  }
}

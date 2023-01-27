import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BranchListActions, IBranchList, IBranchInfo, BranchInfoActions } from '../../../../../core/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SVG_DATA = {collection: 'standard', class: 'hierarchy', name: 'hierarchy'};

@Component({
  selector: 'cbs-branches',
  templateUrl: 'branch-list.component.html',
  styleUrls: ['branch-list.component.scss']
})

export class BranchListComponent implements OnInit, OnDestroy {
  public branches: any;
  public svgData = SVG_DATA;
  public queryObject = {
    page: 1
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'BRANCHES',
      link: '/configuration/branches'
    }
  ];

  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private branchListActions: BranchListActions,
              private branchListStore$: Store<IBranchList>,
              private branchInfoStore$: Store<IBranchInfo>,
              private store$: Store<fromRoot.State>,
              private branchInfoActions: BranchInfoActions,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.branches = this.store$.pipe(select(fromRoot.getBranchListState));
    this.currentPageSub = this.branches.pipe(this.getBranchesCurrentPage())
      .subscribe((page: number) => {
        this.queryObject.page = page + 1;
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;

      if ( this.queryObject.page !== 1 ) {
        this.branchListStore$.dispatch(this.branchListActions.fireInitialAction(this.queryObject));
      } else {
        this.branchListStore$.dispatch(this.branchListActions.fireInitialAction());
      }
    });
    this.resetBranchInfo();
  }

  getBranchesCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  resetBranchInfo() {
    this.branchInfoStore$.dispatch(this.branchInfoActions.fireResetAction());
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/branches'], navigationExtras);
  }

  goToBranchDetails(branch) {
    this.router.navigate(['/configuration', 'branches', 'info', branch.id])
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

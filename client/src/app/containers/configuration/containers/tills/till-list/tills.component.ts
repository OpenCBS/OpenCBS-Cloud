import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TillListActions, ITillList } from '../../../../../core/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cbs-tills',
  templateUrl: './tills.component.html',
  styleUrls: ['./tills.component.scss']
})
export class TillsComponent implements OnInit, OnDestroy {
  public svgData = {
    collection: 'standard',
    class: 'client',
    name: 'client'
  };
  public queryObject = {
    page: 1
  };
  public tills: any;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TELLER_MANAGEMENT',
      link: '/configuration/tills'
    }
  ];

  private currentPageSub: any;
  private paramsSub: any;

  constructor(private tillListStore$: Store<ITillList>,
              private tillListActions: TillListActions,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.tills = this.store$.select(fromRoot.getTillListState);
    this.currentPageSub = this.tills.pipe(this.getTillsCurrentPage()).subscribe((page: number) => {
      this.queryObject.page = page + 1;
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      if ( this.queryObject.page !== 1 ) {
        this.tillListStore$.dispatch(this.tillListActions.fireInitialAction(this.queryObject));
      } else {
        this.tillListStore$.dispatch(this.tillListActions.fireInitialAction());
      }
    });
  }

  getTillsCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/tills'], navigationExtras);
  }

  goToTillDetails(till) {
    this.router.navigate(['/configuration', 'tills', till.id])
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

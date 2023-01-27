import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { IBondList } from '../../../core/store/bond/bond-list';
import { BondState } from '../../../core/store/bond/bond';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cbs-bond-list',
  templateUrl: 'bond-list.component.html',
  styleUrls: ['bond-list.component.scss']
})

export class BondListComponent implements OnInit, OnDestroy {
  public bondData: Observable<IBondList>;
  public svgData = {
    collection: 'custom',
    class: 'custom40',
    name: 'custom40'
  };
  public searchQuery = '';
  public queryObject = {
    search: '',
    page: 1
  };
  private paramsSub: any;
  private currentPageSub: any;

  constructor(private bondListStore$: Store<IBondList>,
              private bondStore$: Store<BondState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.bondStore$.dispatch(new fromStore.ResetBond());
    this.bondData = this.store$.select(fromRoot.getBondListState);
    this.currentPageSub = this.bondData
      .pipe((this.getCurrentPage()))
      .subscribe((page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {
          page: page + 1
        });
      });

    this.paramsSub = this.route.queryParams
      .subscribe(query => {
        this.queryObject.search = query['search'] ? query['search'] : '';
        this.queryObject.page = query['page'] ? query['page'] : 1;

        this.searchQuery = query['search'] ? query['search'] : '';
        if (this.queryObject.page !== 1 && this.searchQuery.search) {
          this.bondListStore$.dispatch(new fromStore.LoadBonds(this.queryObject));
        } else {
          this.bondListStore$.dispatch(new fromStore.LoadBonds());
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
    this.router.navigate(['/bonds'], navigationExtras);
  }

  goToBond(bond: any) {
    this.router.navigate(['/bonds', bond.data.id, 'info']);
  }

  goToNextPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/bonds'], navigationExtras);
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

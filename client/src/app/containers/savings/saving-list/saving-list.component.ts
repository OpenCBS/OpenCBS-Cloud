import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ISavingList } from '../../../core/store/saving/saving-list';
import { ISavingState } from '../../../core/store/saving/saving';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cbs-saving-list',
  templateUrl: 'saving-list.component.html',
  styleUrls: ['saving-list.component.scss']
})

export class SavingListComponent implements OnInit, OnDestroy {
  public savingData: Observable<ISavingList>;
  public svgData = {
    collection: 'standard',
    class: 'case',
    name: 'case'
  };
  public searchQuery = '';
  public queryObject = {
    search: '',
    page: 1
  };

  private paramsSub: any;
  private currentPageSub: any;

  constructor(private savingListStore$: Store<ISavingList>,
              private savingStore$: Store<ISavingState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.savingStore$.dispatch(new fromStore.ResetSaving());
    this.savingData = this.store$.pipe(select(fromRoot.getSavingListState));
    this.currentPageSub = this.savingData.pipe((this.getCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? query['page'] : 1;

      this.searchQuery = query['search'] ? query['search'] : '';
      if (this.queryObject.page !== 1 && this.searchQuery.search) {
        this.savingListStore$.dispatch(new fromStore.LoadSavings(this.queryObject));
      } else {
        this.savingListStore$.dispatch(new fromStore.LoadSavings());
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
    this.router.navigate(['/savings'], navigationExtras);
  }

  goToSaving(saving: any) {
    this.router.navigate(['/savings', saving.data.id, 'info']);
  }

  goToNextPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/savings'], navigationExtras);
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

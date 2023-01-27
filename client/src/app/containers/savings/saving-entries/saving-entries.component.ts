import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromStore from '../../../core/store';
import * as fromRoot from '../../../core/core.reducer';
import { DataTable } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { ISavingEntries, ISavingState, SavingEntriesActions } from '../../../core/store';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'cbs-saving-entries',
  templateUrl: 'saving-entries.component.html',
  styleUrls: ['./saving-entries.component.scss']
})

export class SavingEntriesComponent implements OnInit, OnDestroy {
  public queryObject = {
    page: 1
  };
  @ViewChild('dt', {static: false}) dataTable: DataTable;
  public breadcrumb = [];
  public entriesState: Observable<ISavingEntries>;

  private savingId: number;
  private savingSub: Subscription;
  private routeSub: Subscription;
  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private savingStore$: Store<ISavingState>,
              private savingEntriesActions: SavingEntriesActions,
              private savingEntriesStore$: Store<ISavingEntries>) {
  }

  ngOnInit() {
    this.entriesState = this.store$.pipe(select(fromRoot.getSavingEntriesState));
    this.routeSub = this.route.parent.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.savingId = params.id;
      }
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? query['page'] : 1;

      if ( this.queryObject.page !== 1 ) {
        this.savingEntriesStore$.dispatch(this.savingEntriesActions.fireInitialAction({
          id: this.savingId,
          ...this.queryObject
        }));
      } else {
        this.savingEntriesStore$.dispatch(this.savingEntriesActions.fireInitialAction({
          id: this.savingId
        }));
      }
    });

    this.currentPageSub = this.entriesState.pipe((this.getCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.savingSub = this.savingStore$.pipe(select(fromRoot.getSavingState)).subscribe(
      (savingState: ISavingState) => {
        if ( savingState['loaded'] && !savingState['error'] && savingState['success'] ) {
          const savings = savingState.saving;
          const profileType = savings['profileType'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: savings['profileName'],
              link: `/profiles/${profileType}/${savings['profileId']}/info`
            },
            {
              name: 'SAVINGS',
              link: `/profiles/${profileType}/${savings['id']}/savings`
            },
            {
              name: 'ENTRIES',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.savingStore$.dispatch(new fromStore.SetSavingBreadcrumb(this.breadcrumb));
    }, 700);
  }

  getCurrentPage = () => {
    return state => state
      .map(s => {
        return s.currentPage;
      });
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/savings', this.savingId, 'entries'], navigationExtras);
  }

  resetState() {
    this.savingEntriesStore$.dispatch(this.savingEntriesActions.fireResetAction());
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.savingSub.unsubscribe();
    this.paramsSub.unsubscribe();
    this.currentPageSub.unsubscribe();
  }
}

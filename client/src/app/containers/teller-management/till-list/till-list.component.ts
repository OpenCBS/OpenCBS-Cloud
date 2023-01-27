import { of as observableOf } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { ITillList, IUpdateTill, TillInfoService, TillListActions } from '../../../core/store';
import { CurrentUserAppState } from '../../../core/store/users/current-user';
import * as fromRoot from '../../../core/core.reducer';

@Component({
  selector: 'cbs-till-list',
  templateUrl: 'till-list.component.html',
  styleUrls: ['till-list.component.scss']
})

export class TillListComponent implements OnInit, OnDestroy {
  public openTillForm: FormGroup;
  public config = {
    url: `${environment.API_ENDPOINT}users/tellers`
  };
  public isHeadTeller = false;
  public date: any;
  public expanded = false;
  public queryObject = {
    search: '',
    page: 1
  };
  public searchQuery = '';
  public opened = false;
  public isOpened = false;
  public isTillModal = false;
  public svgData = {
    collection: 'standard',
    class: 'groups',
    name: 'groups'
  };
  public balance = [];
  public tillUpdateSub: any;
  public tills: any;

  private currentUserSub: any;
  private till: any;
  private currentPageSub: any;
  private paramsSub: any;

  constructor(private router: Router,
              private tillListStore$: Store<ITillList>,
              private tillListActions: TillListActions,
              private tillService: TillInfoService,
              private store$: Store<fromRoot.State>,
              private userStore$: Store<CurrentUserAppState>,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private tillUpdateStore$: Store<IUpdateTill>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.tills = this.store$.select(fromRoot.getTillListState);

    this.currentUserSub = this.store$.select(fromRoot.getCurrentUserState).subscribe(user => {
      user['permissions'].forEach(section => {
        if ( section['group'] === 'TELLER_MANAGEMENT' ) {
          if ( section['permissions'].some(permission => (permission === 'HEAD_TELLER')) ) {
            this.isHeadTeller = true;
          }
        }
      });
    });

    this.currentPageSub = this.tills.pipe(this.getTillsCurrentPage()).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.search = query['search'] ? query['search'] : '';
      this.queryObject.page = query['page'] ? query['page'] : 1;

      this.searchQuery = query['search'] ? query['search'] : '';
      if ( this.queryObject.page !== 1 && this.searchQuery.search ) {
        this.tillListStore$.dispatch(this.tillListActions.fireInitialAction(this.queryObject));
      } else {
        this.tillListStore$.dispatch(this.tillListActions.fireInitialAction());
      }
    });
    this.tillUpdateSub = this.store$.select(fromRoot.getTillUpdateState)
      .subscribe((tillUpdate: IUpdateTill) => {
        if ( tillUpdate.loaded && tillUpdate.success && !tillUpdate.error ) {
          this.loadTills();
        }
      });
    this.openTillForm = new FormGroup({
      tellerId: new FormControl('', Validators.required)
    });
    this.loadTills();
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
    this.router.navigate(['/till'], navigationExtras);
  }

  loadTills() {
    this.tillListStore$.dispatch(this.tillListActions.fireInitialAction());
  }

  changeSize(boolean) {
    this.expanded = boolean;
  }

  clearSearch() {
    this.search();
  }

  search(query?) {
    this.queryObject.search = query || '';
    this.queryObject.page = 1;

    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject.search ? this.queryObject : {}
    };

    this.router.navigate(['/till'], navigationExtras);
  }

  openTill(till) {
    this.opened = true;
    this.clearValues();
    this.till = till;
    this.expanded = false;
    this.isTillModal = true;
  }

  closeTill(till) {
    this.clearValues();
    const theDate = new Date();
    theDate.setHours(theDate.getHours() + 6);
    const correctDate = theDate.toISOString().split('.')[0];
    this.tillService.getTillBalance(till.id, correctDate).pipe(
      catchError(err => observableOf(err.error)))
      .subscribe(res => {
        this.balance = res;
      });
    this.isOpened = true;
    this.till = till;
    this.expanded = false;
    this.isTillModal = false;
  }

  clearValues() {
    this.balance.length = 0;
    this.openTillForm.reset();
  }

  submit(form) {
    if ( this.isTillModal ) {
      this.tillService.openTill(form.controls.tellerId.value, this.till.id).pipe(
        catchError(err => observableOf(err.error)))
        .subscribe(res => {
          if ( res.status === 200 ) {
            this.translate.get('OPEN_SUCCESS').subscribe((translation: string) => {
              this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.loadTills();
          } else {
            this.toastrService.error(null, res.error.message, environment.ERROR_TOAST_CONFIG);
          }
        });
      this.opened = false;
    } else {
      this.tillService.closeTill(this.till.teller.id, this.till.id).pipe(
        catchError(err => observableOf(err.error)))
        .subscribe(res => {
          if ( res.status === 200 ) {
            this.translate.get('CLOSE_SUCCESS').subscribe((translation: string) => {
              this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.loadTills();
          } else {
            this.toastrService.error(null, res.error.message, environment.ERROR_TOAST_CONFIG);
          }
        });
      this.isOpened = false;
    }
  }

  hideCloseModal() {
    this.isOpened = false;
  }

  cancel() {
    this.opened = false;
  }

  goToTill(till) {
    if ( till['status'] !== 'CLOSED' ) {
      this.router.navigate(['/till', till.id, 'list'])
    }
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
    this.tillUpdateSub.unsubscribe();
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }

}

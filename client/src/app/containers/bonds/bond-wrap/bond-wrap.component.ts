import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { environment } from '../../../../environments/environment';
import { BondState } from '../../../core/store/bond/bond';
import { BondSideNavService } from '../shared/services/bond-side-nav.service';
import { BondFormState } from '../../../core/store/bond/bond-form/bond-form.interfaces';
import { BondFormExtraService } from '../shared/services/bond-extra.service';
import { filter } from 'rxjs/operators';
import { BondRollbackService } from '../shared/services/bond-rollback.service';

@Component({
  selector: 'cbs-bond-wrap',
  templateUrl: 'bond-wrap.component.html',
  styleUrls: ['./bond-wrap.component.scss']
})
export class BondWrapComponent implements OnInit, OnDestroy {
  public bondStatus: string;
  public breadcrumb = [];
  public svgData = {
    collection: 'custom',
    class: 'custom40',
    name: 'custom40'
  };
  public isLoading = false;
  public bondNavConfig = [];
  public bond: any;
  public opened = false;
  public bondState: any;
  public isEventsPage: any;
  public showSystem: false;
  public showDeleted: false;

  private routeSub: any;
  private bondSub: any;
  private firstChildRouteSub: any;

  constructor(public bondStore$: Store<BondState>,
              public route: ActivatedRoute,
              public bondSideNavService: BondSideNavService,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public store$: Store<fromRoot.State>,
              public router: Router,
              private bondFormStore$: Store<BondFormState>,
              private bondFormExtraService: BondFormExtraService,
              private rollbackService: BondRollbackService) {
  }

  ngOnInit() {
    this.routeSub = this.route.params
    .subscribe((params: { id }) => {
      this.bond = params;
      if (params && params.id) {
        this.bondStore$.dispatch(new fromStore.LoadBond(params.id));
      }
    });

    this.route.firstChild.url.subscribe((data: UrlSegment[]) => {
      this.isEventsPage = data[0].path === 'events';
      if (this.isEventsPage) {
        this.uncheckDeletedAndSystemEventsCheckbox()
      }
    });

    this.firstChildRouteSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((val: NavigationEnd) => {
        const url = val.url.split('/');
        this.isEventsPage = url[url.length - 1] === 'events';
        if (this.isEventsPage) {
          this.uncheckDeletedAndSystemEventsCheckbox()
        }
      });


    this.bondSub = this.bondStore$.select(fromRoot.getBondState)
    .subscribe((bondState: BondState) => {
      this.bondState = bondState;
      if (bondState.loaded && bondState.success && bondState.bond) {
        this.breadcrumb = bondState['breadcrumb'];
        this.bond = bondState.bond;
        this.bondStatus = this.bond['status'];
        this.bondNavConfig = this.bondSideNavService.getNavList('bonds', {
          bondId: this.bond['id'],
          editMode: false,
          createMode: false,
          status: this.bond['status']
        });
        this.isLoading = false;
        this.bondFormExtraService.setState(bondState);
        this.bondFormStore$.dispatch(
          new fromStore.PopulateBond({
            data: {
              ...bondState.bond
            },
            valid: true,
            bondProduct: bondState.bond.bondProduct
          }));

      } else if (bondState.loaded && !bondState.success && bondState.error) {
        this.toastrService.error(`ERROR: ${bondState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
        this.resetState();
        this.isLoading = false;
        this.router.navigateByUrl('bonds');
      }
    })
  }

  uncheckDeletedAndSystemEventsCheckbox() {
    this.showSystem = false;
    this.showDeleted = false;
  }

  openModal() {
    this.opened = true;
  }

  closeModal() {
    this.opened = false;
  }

  showDeletedEvents(e) {
    this.bondFormExtraService.announceShowDeletedEventsStatusChange(e.target.checked);
  }

  showSystemEvents(e) {
    this.showDeleted = false;
    this.bondFormExtraService.announceShowSystemEventsStatusChange(e.target.checked);
  }

  resetState() {
    this.bondStore$.dispatch(new fromStore.ResetBond());
  }

  startBond() {
    this.bondStore$.dispatch(new fromStore.StartBond(this.bond['id']));
  }

  rollBack() {
    this.rollbackService.fireRollback();
    this.showSystem = false;
    this.showDeleted = false;
  }

  ngOnDestroy() {
    this.bondSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.firstChildRouteSub.unsubscribe();
    this.bondStore$.dispatch(new fromStore.ResetBond());
  }
}

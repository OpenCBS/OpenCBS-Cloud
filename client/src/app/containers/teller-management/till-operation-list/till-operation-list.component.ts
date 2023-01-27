import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ITillInfo } from '../../../core/store';
import * as fromRoot from '../../../core/core.reducer';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TellerSideNavService } from '../shared/teller-management-side-nav.service';
import { TellerListState } from '../../../core/store/tellers/teller-list/teller-list.reducer';
import * as fromStore from '../../../core/store';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'standard',
  class: 'groups',
  name: 'groups'
};

@Component({
  selector: 'cbs-till-operation-list',
  templateUrl: 'till-operation-list.component.html',
  styleUrls: ['./till-operation-list.component.scss']
})

export class TillOperationListComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;
  public tillId: number;
  public till: any;
  public isLoading = false;
  public tellerNavConfig = [];
  public queryObject = {
    search: '',
    page: 1
  };

  private routeSub: Subscription;
  private tillInfoSub: Subscription;
  private tillInfoSubs: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              public toastrService: ToastrService,
              public tellerSideNavService: TellerSideNavService,
              private tillStore$: Store<TellerListState>,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.params.subscribe(
      (params: { id }) => {
        if ( params.id ) {
          this.tillId = params.id;
          this.tellerNavConfig = this.tellerSideNavService.getNavList('till', {
            tillId: this.tillId,
            editMode: false,
            createMode: false
          });
          this.tillStore$.dispatch(new fromStore.LoadTellerList(this.tillId));
        }
      });

    this.tillInfoSub = this.store$.select(fromRoot.getTillInfoState).subscribe(
      (tillInfo: ITillInfo) => {
        if ( tillInfo.loaded && tillInfo.success && !tillInfo.error ) {
          this.till = tillInfo['data'];
          this.tellerNavConfig = this.tellerSideNavService.getNavList('till', {
            tillId: this.till.id,
            editMode: false,
            createMode: false
          });
        }
      });

    this.tillInfoSubs = this.tillStore$.select(fromRoot.getTellerListState).subscribe(
      (tillInfo: TellerListState) => {
        if ( tillInfo.loaded && tillInfo.success && !tillInfo.error ) {
          this.till = tillInfo;
          this.breadcrumbLinks = this.till['breadcrumb'];
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}

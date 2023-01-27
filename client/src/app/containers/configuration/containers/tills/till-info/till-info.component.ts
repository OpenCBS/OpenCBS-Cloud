import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TillInfoActions, ITillInfo } from '../../../../../core/store';
import { ActivatedRoute } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';

@Component({
  selector: 'cbs-till-info',
  templateUrl: 'till-info.component.html'
})

export class TillInfoComponent implements OnInit, OnDestroy {
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
  public svgData = {
    collection: 'standard',
    class: 'client',
    name: 'client'
  };
  public till: any;

  private routeSub: any;
  private tillInfoSub: any;

  constructor(private tillInfoStore$: Store<ITillInfo>,
              private tillInfoActions: TillInfoActions,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params.id) {
        this.tillInfoStore$.dispatch(this.tillInfoActions.fireInitialAction(params.id))
      }
    });

    this.till = this.store$.select(fromRoot.getTillInfoState);

    this.tillInfoSub = this.store$.select(fromRoot.getTillInfoState)
    .subscribe((tillInfo: ITillInfo) => {
      if (tillInfo.loaded && tillInfo.success && !tillInfo.error) {
        this.breadcrumbLinks[2] = {
          name: tillInfo['data']['name'],
          link: ''
        }
      }
    });
  }

  resetState() {
    this.tillInfoStore$.dispatch(this.tillInfoActions.fireResetAction());
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.tillInfoSub.unsubscribe();
    this.resetState();
  }
}

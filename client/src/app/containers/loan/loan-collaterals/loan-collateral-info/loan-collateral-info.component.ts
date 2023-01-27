import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import {
  ILoanInfo,
  ILoanAppState,
  ILoanAppCollateral,
} from '../../../../core/store';
import { Subscription } from 'rxjs';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-collateral-info',
  templateUrl: 'loan-collateral-info.component.html',
  styleUrls: ['loan-collateral-info.component.scss']
})

export class LoanCollateralInfoComponent implements OnInit, OnDestroy {
  public loanAppCollateralSub: any;
  public collateralState: any;
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;
  public loan: any;
  public profile: any;
  public loanStatusEnum = LoanAppStatus;

  private collateralId: number;
  private collateralRouteSub: Subscription;
  private loanSub: Subscription;
  private loanApplicationSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppCollateralStore$: Store<ILoanAppCollateral>) {
  }

  ngOnInit() {
    this.collateralRouteSub = this.route.params
      .subscribe((params: { id }) => {
        if ( params.id ) {
          this.collateralId = params.id;
        }
      });
    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          this.loan = loan['loan'];
          this.profile = this.loan.profile;
          const profileType = this.profile.type === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: this.profile ['name'],
              link: `/profiles/${profileType}/${this.profile ['id']}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: this.loan.code,
              link: `/loans/${this.loan.id}/${this.profile.type.toLowerCase()}/info`
            },
            {
              name: 'COLLATERALS',
              link: `/loans/${this.loan.id}/collateral`
            }
          ];
        }
      });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.subscribeToLoanAppCollateral(loanAppState['loanApplication']['id']);
          this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumbLinks));
        }
      });
  }

  subscribeToLoanAppCollateral(loanAppId) {
    if ( this.loanAppCollateralSub ) {
      this.loanAppCollateralSub.unsubscribe();
    }
    this.loanAppCollateralSub = this.store$.pipe(select(fromRoot.getLoanAppCollateralState))
      .subscribe((collateralState) => {
          if ( !collateralState.loaded && !collateralState.loading
            && !collateralState.success && !collateralState.error ) {
            this.loanAppCollateralStore$.dispatch(
              new fromStore.LoadCollateral({loanApplicationId: loanAppId, collateralId: this.collateralId}));
          }

          if ( collateralState.loaded && collateralState.success && !collateralState.error ) {
            this.collateralState = collateralState;
            this.breadcrumbLinks[3] = {
              name: this.collateralState.collateral['name'],
              link: ''
            };
          }
        }
      );
  }

  getLookupVal(data) {
    if ( data ) {
      const obj = JSON.parse(data);
      return obj['name'] ? obj['name'] : '';
    } else {
      return '';
    }
  }

  ngOnDestroy() {
    this.loanAppCollateralSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.loanSub.unsubscribe();
    this.collateralRouteSub.unsubscribe();
    this.loanAppCollateralStore$.dispatch(new fromStore.ResetCollateral());
  }
}

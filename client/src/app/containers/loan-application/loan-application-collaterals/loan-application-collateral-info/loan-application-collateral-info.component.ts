import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import {
  ILoanAppState,
  ILoanAppFormState,
  ILoanAppCollateral
} from '../../../../core/store';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';

@Component({
  selector: 'cbs-loan-application-collateral-info',
  templateUrl: 'loan-application-collateral-info.component.html',
  styleUrls: ['./loan-application-collateral-info.component.scss']
})

export class LoanAppCollateralInfoComponent implements OnInit, OnDestroy {
  public loanAppId: number;
  public collateralId: number;
  public collateralState: any;
  public breadcrumbLinks = [];
  public svgData = {
    collection: 'custom',
    class: 'custom41',
    name: 'custom41'
  };
  public loanApplication: any;
  public loanAppStatusEnum = LoanAppStatus;

  private loanApplicationSub: any;
  private loanAppCollateralSub: any;
  private routeSub: any;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppCollateralStore$: Store<ILoanAppCollateral>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private loanAppFormStore$: Store<ILoanAppFormState>) {
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('collaterals'));
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params.id) {
        this.collateralId = params.id;
      }
    });

    this.loanApplicationSub = this.store$.select(fromRoot.getLoanApplicationState).subscribe(
      (loanAppState: ILoanAppState) => {
        if (loanAppState.success && loanAppState.loaded && loanAppState.loanApplication) {
          this.loanAppId = loanAppState.loanApplication['id'];
          this.loanApplication = loanAppState.loanApplication;
          const loanProfile = loanAppState.loanApplication['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: loanAppState.loanApplication['code'],
              link: ''
            },
            {
              name: 'COLLATERALS',
              link: `/loan-applications/${this.loanAppId}/collateral`
            }
          ];

          this.subscribeToLoanAppCollateral(this.loanAppId);
        }
      }
    );
  }

  subscribeToLoanAppCollateral(loanAppId) {
    if (this.loanAppCollateralSub) {
      this.loanAppCollateralSub.unsubscribe();
    }
    this.loanAppCollateralSub = this.store$.select(fromRoot.getLoanAppCollateralState).subscribe(
      (collateralState) => {
        if (!collateralState.loaded && !collateralState.loading
          && !collateralState.success && !collateralState.error) {
          this.loanAppCollateralStore$.dispatch(
            new fromStore.LoadCollateral({loanApplicationId: this.loanAppId, collateralId: this.collateralId})
          );
        }

        if (collateralState.loaded && collateralState.success && !collateralState.error) {
          this.collateralState = collateralState;
          this.breadcrumbLinks[3] = {
            name: this.collateralState.collateral['name'],
            link: ''
          };
        }
      }
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.loanAppCollateralSub.unsubscribe();
  }

  getLookupVal(data) {
    if (data) {
      return data['name'] ? data['name'] : '';
    } else {
      return '';
    }
  }
}

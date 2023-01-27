import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  ILoanAppState,
  ILoanInfo,
  ILoanAppCollateralList,
} from '../../../../core/store';
import { ILoanAppCollateralDelete } from '../../../../core/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-collateral-list',
  templateUrl: 'loan-collateral.component.html',
  styleUrls: ['loan-collateral.component.scss']
})

export class LoanCollateralListComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumb: any;
  public profile: any;
  public loan: any;
  public collateralData: any;
  public loanAppId: number;

  private loanSub: Subscription;
  private loanApplicationSub: Subscription;
  private deleteCollateralSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private store$: Store<fromRoot.State>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppCollateralStore$: Store<ILoanAppCollateralList>,
              private loanAppCollateralDelStore$: Store<ILoanAppCollateralDelete>,
              private toastrService: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          this.loan = loan.loan;
          this.profile = this.loan.profile;
          const profileType = this.profile.type === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: this.profile.name,
              link: `/profiles/${profileType}/${this.profile.id}/info`
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
              link: ''
            }
          ];
        }
      });

    this.collateralData = this.store$.pipe(select(fromRoot.getLoanAppCollateralsState));
    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanAppId = loanAppState['loanApplication']['id'];
          this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
          this.loanAppCollateralStore$.dispatch(new fromStore.LoadCollaterals(this.loanAppId));
        }
      });

    this.deleteCollateralSub = this.loanAppCollateralDelStore$.pipe(select(fromRoot.getLoanAppCollateralDeleteState))
      .subscribe((collateralDelstate: ILoanAppCollateralDelete) => {
        if ( collateralDelstate.loaded && collateralDelstate.success && !collateralDelstate.error ) {
          this.translate.get('DELETE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.loanAppCollateralStore$.dispatch(new fromStore.LoadCollaterals(this.loanAppId));
          this.resetDelState();
        } else if ( collateralDelstate.loaded && !collateralDelstate.success && collateralDelstate.error ) {
          this.translate.get('DELETE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetDelState();
        }
      });
  }

  public getUndeletedCollaterals(collaterals: any[]) {
    return collaterals.filter((collateral) => !collateral['deleted']);
  }

  removeCollateral(collateralId) {
    this.loanAppCollateralDelStore$.dispatch(
      new fromStore.DeleteLoanApplicationCollateral({loanAppId: this.loanAppId, collateralId: collateralId}));
  }

  resetDelState() {
    this.loanAppCollateralDelStore$.dispatch(new fromStore.DeleteLoanApplicationCollateralReset());
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.deleteCollateralSub.unsubscribe();
  }
}

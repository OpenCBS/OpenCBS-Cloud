import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  ILoanAppState,
  ILoanAppCollateralList,
  ILoanAppCollateral,
  ILoanAppFormState
} from '../../../../core/store/loan-application';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { LoanAppSubmitService } from '../../shared/services/loan-app-submit.service';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';
import { ILoanAppCollateralDelete } from '../../../../core/store/';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-application-collateral-list',
  templateUrl: 'loan-application-collateral-list.component.html',
  styleUrls: ['loan-application-collateral-list.component.scss']
})
export class LoanAppCollateralListComponent implements OnInit, OnDestroy {
  public loanAppId: number;
  public breadcrumbLinks = [];
  public loanApplication: any;
  public LoanAppStatus = LoanAppStatus;
  public loanAppStatus: string;
  public opened = false;
  public text: string;
  public svgData = SVG_DATA;
  public collateralsData: Observable<ILoanAppCollateralList>;
  public submitService = this.loanAppSubmitService;
  public readOnly = false;
  public progressValue: any;

  private loanApplicationSub: Subscription;
  private deleteCollateralSub: Subscription;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppCollateralStore$: Store<ILoanAppCollateral>,
              private loanAppCollateralsStore$: Store<ILoanAppCollateralList>,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private store$: Store<fromRoot.State>,
              private loanAppSubmitService: LoanAppSubmitService,
              private loanAppCollateralDelStore$: Store<ILoanAppCollateralDelete>,
              private toastrService: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.resetCollateralState();
    this.loanAppFormStore$.dispatch(new fromStore.SetState('collaterals'));
    this.collateralsData = this.store$.pipe(select(fromRoot.getLoanAppCollateralsState));

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
          if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
            this.loanApplication = loanAppState.loanApplication;
            this.readOnly = this.loanApplication.readOnly;
            this.loanAppStatus = loanAppState.loanApplication['status'];
            switch (this.loanAppStatus) {
              case 'IN_PROGRESS':
                this.progressValue = 25 + '%';
                break;
              case 'PENDING':
                this.progressValue = 50 + '%';
                break;
              case 'APPROVED':
                this.progressValue = 75 + '%';
                break;
              default:
                this.progressValue = 100 + '%';
            }

            this.loanAppId = loanAppState.loanApplication['id'];
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
                link: ''
              }
            ];

            this.loanAppCollateralsStore$.dispatch(new fromStore.LoadCollaterals(this.loanAppId));
          }
        }
      );

    this.deleteCollateralSub = this.loanAppCollateralDelStore$.pipe(select(fromRoot.getLoanAppCollateralDeleteState))
      .subscribe((collateralDelstate: ILoanAppCollateralDelete) => {
        if ( collateralDelstate.loaded && collateralDelstate.success && !collateralDelstate.error ) {
          this.translate.get('DELETE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.loanAppCollateralsStore$.dispatch(new fromStore.LoadCollaterals(this.loanAppId));
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
    return collaterals.filter((collateral) => !collateral['deleted'])
  }

  resetCollateralState() {
    this.loanAppCollateralStore$.dispatch(new fromStore.ResetCollateral());
  }

  openModal(text) {
    this.opened = true;
    this.text = text;
  }

  closeModal() {
    this.opened = false;
  }

  removeCollateral(collateralId) {
    this.loanAppCollateralDelStore$.dispatch(
      new fromStore.DeleteLoanApplicationCollateral({loanAppId: this.loanAppId, collateralId: collateralId}));
  }

  resetDelState() {
    this.loanAppCollateralDelStore$.dispatch(new fromStore.DeleteLoanApplicationCollateralReset());
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
    this.deleteCollateralSub.unsubscribe();
  }
}

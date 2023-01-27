import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  ILoanAppGuarantor,
  ILoanAppState,
  ILoanAppFormState,
} from '../../../../core/store/loan-application';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { Router } from '@angular/router';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-app-guarantor-info',
  templateUrl: 'loan-application-guarantors-info.component.html',
  styleUrls: ['loan-application-guarantors-info.component.scss']
})

export class LoanAppGuarantorInfoComponent implements OnInit, OnDestroy {
  public loanAppId: number;
  public breadcrumbLinks = [];
  public guarantor: any;
  public loanApp: any;
  public svgData = SVG_DATA;
  public guarantorId: number;
  public loanApplication: any;
  public loanAppStatusEnum = LoanAppStatus;

  private guarantorSub: any;
  private routeSub: any;
  private loanAppSub: any;

  constructor(private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private loanAppGuarantorStore$: Store<ILoanAppGuarantor>,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private router: Router) {
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('guarantors'));
    this.routeSub = this.route.params.subscribe(params => {
      this.guarantorId = params['id'];
    });

    this.loanAppSub = this.store$.select(fromRoot.getLoanApplicationState)
      .subscribe((state: ILoanAppState) => {
        if ( state.success && state.loaded && state.loanApplication ) {
          const guarantors = state.loanApplication['guarantors'];
          this.loanApp = state.loanApplication['profile']['name'];
          this.loanAppId = state.loanApplication['id'];
          this.loanApplication = state.loanApplication;
          this.subscribeToLoanAppGuarantor(this.loanAppId);
        }
      });
  }

  goToGuarantorProfile(profile: any) {
    const profileType = profile.type === 'PERSON' ? 'people' : 'companies';
    this.router.navigate(['/profiles', profileType, profile.id, 'info']);
  }

  subscribeToLoanAppGuarantor(loanAppId) {
    if ( this.guarantorSub ) {
      this.guarantorSub.unsubscribe();
    }
    this.guarantorSub = this.store$.pipe(select(fromRoot.getLoanAppGuarantorState))
      .subscribe((guarantorState: ILoanAppGuarantor) => {
        if ( !guarantorState.loaded && !guarantorState.loading && !guarantorState.error && !guarantorState.success ) {
          this.getGuarantor(loanAppId, this.guarantorId);
        }

        if ( guarantorState.loaded && guarantorState.success && !guarantorState.error ) {
          this.guarantor = guarantorState.guarantor;
          const loanProfile = this.loanApplication['profile'];
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
              name: this.loanApplication['code'],
              link: ''
            },
            {
              name: 'GUARANTORS',
              link: `/loan-applications/${loanAppId}/guarantors`
            },
            {
              name: `${this.guarantor.profile.name}`,
              link: ''
            }
          ];
        }
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.guarantorSub.unsubscribe();
    this.loanAppSub.unsubscribe();
  }

  getGuarantor(loanAppId, guarantorId) {
    this.loanAppGuarantorStore$.dispatch(new fromStore.LoadGuarantor({loanApplicationId: loanAppId, guarantorId: guarantorId}));
  }
}

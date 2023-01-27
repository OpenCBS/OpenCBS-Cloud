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
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-guarantor-info',
  templateUrl: 'loan-guarantors-info.component.html',
  styleUrls: ['loan-guarantors-info.component.scss']
})

export class LoanGuarantorInfoComponent implements OnInit, OnDestroy {
  public loan: any;
  public breadcrumbLinks = [];
  public guarantor: any;
  public profile: any;
  public loanApp: any;
  public svgData = SVG_DATA;
  public guarantorId: number;
  public loanApplication: any;
  public loanAppStatusEnum = LoanAppStatus;

  private guarantorSub: Subscription;
  private routeSub: Subscription;
  private loanAppSub: Subscription;

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

    this.loanAppSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((state: ILoanAppState) => {
        if ( state.success && state.loaded && state.loanApplication ) {
          this.loanApp = state.loanApplication;
          this.profile = this.loanApp['profile'];
          this.loan = state.loanApplication['loan'];
          this.loanApplication = state.loanApplication;
          this.subscribeToLoanAppGuarantor(this.loanApp.id);
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
          const profileType = this.profile.type === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
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
              link: `/loans/${this.loanApplication.loan.id}/${this.profile.type.toLowerCase()}/info`
            },
            {
              name: 'GUARANTORS',
              link: `/loans/${this.loan.id}/${this.profile.type.toLowerCase()}/guarantors`
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

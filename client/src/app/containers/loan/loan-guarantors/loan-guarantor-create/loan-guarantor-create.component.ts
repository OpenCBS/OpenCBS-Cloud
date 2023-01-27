import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import {
  ILoanAppState,
  ILoanAppGuarantorCreate,
  ILoanAppFormState
} from '../../../../core/store/loan-application';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { GuarantorFormComponent } from '../../shared/components/guarantor-form/guarantor-form.component';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-guarantor-new',
  templateUrl: 'loan-guarantor-create.component.html',
  styleUrls: ['loan-guarantor-create.component.scss']
})

export class LoanCreateGuarantorComponent implements OnInit, OnDestroy {
  @ViewChild(GuarantorFormComponent, {static: true}) public guarantorForm: GuarantorFormComponent;
  public loanAppId: number;
  public loan: any;
  public profile: any;
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;

  private loanAppProfile: any;
  private createSub: Subscription;

  constructor(private createGuarantorStore$: Store<ILoanAppGuarantorCreate>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private loanAppFormStore$: Store<ILoanAppFormState>) {

    this.createSub = this.store$.pipe(select(fromRoot.getLoanAppCreateGuarantorState))
      .subscribe((state: ILoanAppGuarantorCreate) => {
        if ( state.loaded && state.success ) {
          const newGuarantorId = state.response['id'];
          this.redirectToInfo(this.loan.id, newGuarantorId);
          this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(this.loanAppId));
          this.guarantorForm.getGuarantorsList(this.loanAppId);
          this.createGuarantorStore$.dispatch(new fromStore.CreateGuarantorReset());
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
        }
      });
  }

  redirectToInfo(loanId, newGuarantorId) {
    this.router.navigate(['/loans', loanId, this.profile.type.toLowerCase(), 'guarantors', newGuarantorId]);
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('guarantors'));
    this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((state: ILoanAppState) => {
        if ( state.success && state.loaded && state.loanApplication ) {
          this.loanAppProfile = state.loanApplication['profile'];
          this.loanAppId = state.loanApplication['id'];
          this.loan = state.loanApplication['loan'];
          this.guarantorForm.createForm();
          this.profile = state.loanApplication['profile'];
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
              link: `/loans${this.loan.id}/${this.profile.type.toLowerCase()}/info`
            },
            {
              name: 'GUARANTORS',
              link: `/loans/${this.loan.id}/${this.profile.type.toLowerCase()}/guarantors`
            },
            {
              name: 'ADD',
              link: ''
            }
          ];

          this.guarantorForm.configs.profileLookupUrl
            = {url: `${environment.API_ENDPOINT}loan-applications/${this.loanAppId}/guarantors/lookup`};
        }
      });

  }

  submit() {
    this.createGuarantorStore$
      .dispatch(new fromStore.CreateGuarantor({loanAppId: this.loanAppId, data: this.guarantorForm.form.value}));
  }

  ngOnDestroy() {
    this.createSub.unsubscribe();
  }
}

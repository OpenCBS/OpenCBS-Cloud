import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ILoanAppState,
  ILoanAppGuarantor,
  ILoanAppGuarantorUpdate,
  ILoanAppFormState
} from '../../../../core/store/loan-application';
import { environment } from '../../../../../environments/environment';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { GuarantorFormComponent } from '../../shared/components/guarantor-form/guarantor-form.component';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-guarantor-edit',
  templateUrl: 'loan-guarantor-edit.component.html',
  styleUrls: ['loan-guarantor-edit.component.scss']
})

export class LoanEditGuarantorComponent implements OnInit, OnDestroy {
  @ViewChild(GuarantorFormComponent, {static: false}) guarantorForm: GuarantorFormComponent;
  public breadcrumbLinks = [];
  public guarantor: any;
  public guarantorId: number;
  public formChanged = false;
  public svgData = SVG_DATA;
  public isOpen = false;
  private loanApp: any;
  public loan: any;
  public profile: any;

  private isSubmitting = false;
  private isLeaving = false;
  private cachedData: any;
  private guarantorSub: any;
  private profileType: string;
  private loanAppProfile: any;
  private nextRoute: string;
  private guarantorUpdateSub: Subscription;
  private routeSub: Subscription;
  private loanAppSub: Subscription;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppGuarantorStore$: Store<ILoanAppGuarantor>,
              private guarantorUpdateStore$: Store<ILoanAppGuarantorUpdate>,
              private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private loanAppFormStore$: Store<ILoanAppFormState>) {

    this.guarantorUpdateSub = this.store$.pipe(select(fromRoot.getLoanAppUpdateGuarantorState))
      .subscribe((state: ILoanAppGuarantorUpdate) => {
        if ( state.loaded && state.success && !state.error && state.response ) {
          this.loanAppGuarantorStore$.dispatch(new fromStore.LoadGuarantorSuccess(state.response));
          this.router.navigate(['/loans', this.loan.id, this.profileType.toLowerCase(), 'guarantors', this.guarantorId]);
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
        }
      });
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('guarantors'));
    this.routeSub = this.route.params.subscribe(params => {
      this.guarantorId = params['id'];
    });

    this.loanAppSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanAppProfile = loanAppState.loanApplication['profile'];
          this.profileType = this.loanAppProfile.type;
          this.loanApp = loanAppState.loanApplication;
          this.loan = this.loanApp.loan;
          this.guarantorForm.configs.profileLookupUrl = {
            url: `${environment.API_ENDPOINT}loan-applications/${this.loanApp.id}/guarantors/lookup`
          };
          this.subscribeToLoanAppGuarantor(this.loanApp.id);
        }
      });
  }

  subscribeToLoanAppGuarantor(loanAppId) {
    if ( this.guarantorSub ) {
      this.guarantorSub.unsubscribe();
    }
    this.guarantorSub = this.store$.pipe(select(fromRoot.getLoanAppGuarantorState))
      .subscribe((state: ILoanAppGuarantor) => {
        if ( !state.loaded && !state.loading && !state.error && !state.success ) {
          this.loanAppGuarantorStore$
            .dispatch(new fromStore.LoadGuarantor({loanApplicationId: loanAppId, guarantorId: this.guarantorId}));
        }

        if ( state.loaded && state.success && !state.error ) {
          this.guarantorForm.createForm();
          this.guarantor = state.guarantor;
          const loanGuarantorType = this.guarantor.type === 'PERSON' ? 'people' : 'companies';
          const cachedData = this.getValues(this.guarantor);
          this.guarantorForm.form.valueChanges.subscribe(data => {
            this.formChanged = this.compare(data, cachedData);
          });
          this.cachedData = this.guarantorForm.setValues(this.guarantor);
          this.profile = this.loanApp.profile;
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
              link: `/loans/${this.loan.id}/${this.profile.type.toLowerCase()}/info`
            },
            {
              name: 'GUARANTORS',
              link: `/loans/${this.loan.id}/guarantors`
            },
            {
              name: `${this.guarantor.profile.name}`,
              link: `/profiles/${loanGuarantorType}/${this.guarantor.id}/info`
            },
            {
              name: 'EDIT',
              link: ''
            }
          ];
        }
      });
  }

  compare(guarantorData, cachedData) {
    let status = false;
    for (const key in guarantorData) {
      if ( guarantorData.hasOwnProperty(key) ) {
        if ( cachedData[key] !== guarantorData[key] ) {
          status = true;
        }
      }
    }

    return status;
  }

  getValues(object) {
    const guarantor = Object.assign({}, object);
    const cachedGuarantor = {
      profileId: guarantor.profile.id,
      relationshipId: guarantor.relationship.id,
      amount: guarantor.amount,
      description: guarantor.description
    };
    return cachedGuarantor;
  };

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.guarantorSub.unsubscribe();
    this.loanAppSub.unsubscribe();
    this.guarantorUpdateSub.unsubscribe();
    this.guarantorUpdateStore$.dispatch(new fromStore.UpdateGuarantorReset());
  }

  submit() {
    this.isSubmitting = true;
    this.guarantorForm.form.value.id = this.guarantorId;
    this.guarantorUpdateStore$
      .dispatch(new fromStore.UpdateGuarantor({loanAppId: this.loanApp.id, data: this.guarantorForm.form.value}));
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  ILoanAppState,
  ILoanAppGuarantor,
  ILoanAppFormState,
} from '../../../../core/store/loan-application';
import { LoanAppSubmitService } from '../../shared/services/loan-app-submit.service';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { ILoanAppGuarantorDelete } from '../../../../core/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment.prod';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-app-guarantors',
  templateUrl: 'loan-application-guarantors.component.html',
  styleUrls: ['loan-application-guarantors.component.scss']
})
export class LoanAppGuarantorsComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public loanAppId: number;
  public loanAppState: ILoanAppState;
  public loanApplication: any;
  public LoanAppStatus = LoanAppStatus;
  public loanAppStatus: string;
  public opened = false;
  public text: string;
  public svgData = SVG_DATA;
  public profiles = [];
  public progressValue: any;
  public guarantorsData: any;
  public submitService = this.loanAppSubmitService;
  public readOnly = false;

  private loanApplicationSub: Subscription;
  private deleteGuarantorSub: Subscription;

  constructor(private router: Router,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppGuarantorStore$: Store<ILoanAppGuarantor>,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private store$: Store<fromRoot.State>,
              private loanAppSubmitService: LoanAppSubmitService,
              private loanAppGuarantorDelStore$: Store<ILoanAppGuarantorDelete>,
              private toastrService: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('guarantors'));
    this.resetGuarantorState();

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
          this.loanAppState = loanAppState;
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
            this.guarantorsData = loanAppState.loanApplication['guarantors'].filter(guarantor => guarantor.deleted === false);
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
                name: loanAppState.loanApplication['code'],
                link: ''
              },
              {
                name: 'GUARANTORS',
                link: ''
              }
            ];
          }
        }
      );

    this.deleteGuarantorSub = this.loanAppGuarantorDelStore$.pipe(select(fromRoot.getLoanAppGuarantorDeleteState))
      .subscribe((guarantorDelstate: ILoanAppGuarantorDelete) => {
        if ( guarantorDelstate.loaded && guarantorDelstate.success && !guarantorDelstate.error ) {
          this.translate.get('DELETE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.updateGuarantorList(this.loanAppId);
          this.resetDelState();
        } else if ( guarantorDelstate.loaded && !guarantorDelstate.success && guarantorDelstate.error ) {
          this.translate.get('DELETE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetDelState();
        }
      });
  }

  resetGuarantorState() {
    this.loanAppGuarantorStore$.dispatch(new fromStore.ResetGuarantor());
  }


  goToViewGuarantor(id) {
    this.router.navigate(['/loan-applications', this.loanAppId, 'guarantors', id]);
  }

  openModal(text) {
    this.opened = true;
    this.text = text;
  }

  closeModal() {
    this.opened = false;
  }

  removeGuarantor(guarantorId) {
    this.loanAppGuarantorDelStore$.dispatch(
      new fromStore.DeleteLoanAppGuarantor({loanAppId: this.loanAppId, guarantorId: guarantorId}));
  }

  updateGuarantorList(loanAppId) {
    this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(loanAppId));
  }

  resetDelState() {
    this.loanAppGuarantorDelStore$.dispatch(new fromStore.DeleteLoanAppGuarantorReset());
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
    this.deleteGuarantorSub.unsubscribe();
  }
}

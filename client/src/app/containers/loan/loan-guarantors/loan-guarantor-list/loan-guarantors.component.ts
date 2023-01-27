import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import { ILoanAppGuarantorDelete, ILoanAppState, ILoanInfo } from '../../../../core/store';
import * as fromRoot from '../../../../core/core.reducer';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { LoanAppSubmitService } from '../../../loan-application/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-guarantors',
  templateUrl: 'loan-guarantors.component.html',
  styleUrls: ['loan-guarantors.component.scss']
})

export class LoanGuarantorsComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumb = [];
  public guarantorsData = [];
  public loanAppStateId: number;
  public loanAppState: ILoanAppState;
  public loanState: any;
  public submitService = this.loanAppSubmitService;
  public guarantorId: number;
  public profile: any;
  public opened = false;
  public text: string;

  private loanSub: Subscription;
  private loanApplicationSub: Subscription;
  private deleteGuarantorSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppSubmitService: LoanAppSubmitService,
              private loanAppGuarantorDelStore$: Store<ILoanAppGuarantorDelete>,
              private toastrService: ToastrService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          this.loanState = loan['loan'];
          this.profile = this.loanState.profile;
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
              name: this.loanState.code,
              link: `/loans/${this.loanState.id}/${this.profile.type.toLowerCase()}/info`
            },
            {
              name: 'GUARANTORS',
              link: ''
            }
          ];
        }
      });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.guarantorsData = loanAppState.loanApplication['guarantors'].filter(guarantor => guarantor.deleted === false);
          this.loanAppState = loanAppState;
          this.loanAppStateId = loanAppState.loanApplication['id'];
        }
      });

    this.deleteGuarantorSub = this.loanAppGuarantorDelStore$.pipe(select(fromRoot.getLoanAppGuarantorDeleteState))
      .subscribe((guarantorDelState: ILoanAppGuarantorDelete) => {
        if ( guarantorDelState.loaded && guarantorDelState.success && !guarantorDelState.error ) {
          this.translate.get('DELETE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(this.loanAppStateId));
          this.resetDelState();
        } else if ( guarantorDelState.loaded && !guarantorDelState.success && guarantorDelState.error ) {
          this.translate.get('DELETE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetDelState();
        }
      });
  }

  closeModal() {
    this.opened = false;
  }

  removeModal(guarantorId) {
    this.guarantorId = guarantorId;
    this.opened = true;
  }

  removeGuarantor() {
    this.loanAppGuarantorDelStore$.dispatch(new fromStore.DeleteLoanAppGuarantor({
      loanAppId: this.loanAppStateId, guarantorId: this.guarantorId
    }));
  }

  resetDelState() {
    this.loanAppGuarantorDelStore$.dispatch(new fromStore.DeleteLoanAppGuarantorReset());
  }

  goToViewGuarantor(id) {
    this.router.navigate(['/loans', this.loanState.id, this.profile.type.toLowerCase(), 'guarantors', id]);
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.deleteGuarantorSub.unsubscribe();
  }
}

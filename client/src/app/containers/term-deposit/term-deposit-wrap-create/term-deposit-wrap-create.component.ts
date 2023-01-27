import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ITermDepositCreateState } from '../../../core/store/term-deposit/term-deposit-create';
import { TermDepositSideNavService } from '../shared/services/term-deposit-side-nav.service';
import { TermDepositNewComponent } from '../term-deposit-new/term-deposit-new.component';
import * as moment from 'moment';
import { ParseDateFormatService } from '../../../core/services';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom17',
  name: 'custom17'
};

@Component({
  selector: 'cbs-term-deposit-wrap-create',
  templateUrl: 'term-deposit-wrap-create.component.html'
})

export class TermDepositWrapCreateComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  @ViewChild(TermDepositNewComponent, {static: true}) formComponent: TermDepositNewComponent;


  public svgData = SVG_DATA;
  public termDepositNavConfig = [];
  public profile: any;
  public isLoading = false;
  public breadcrumb = [];
  private createTermDepositSub: any;

  constructor(private createTermDepositStore$: Store<ITermDepositCreateState>,
              private router: Router,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private parseDateFormatService: ParseDateFormatService,
              private store$: Store<fromRoot.State>,
              private termDepositNavConfigSideNavService: TermDepositSideNavService) {
  }

  ngOnInit() {
    this.termDepositNavConfig = this.termDepositNavConfigSideNavService.getNavList('term-deposit', {
      editMode: false,
      createMode: true
    });

    this.createTermDepositSub = this.store$.pipe(select(fromRoot.getTermDepositCreateState)).subscribe(
      (state: ITermDepositCreateState) => {
        if (state.loaded && state.success && !state.error) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewLoanDetails(state.response.id);
        } else if (state.loaded && !state.success && state.error) {
          this.disableSubmitBtn(false);
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    setTimeout(() => {
      this.breadcrumb = [
        {
          name: 'TERM_DEPOSIT',
          link: `/profiles/${this.formComponent.profileType}/${this.formComponent.profileId}/term-deposits`
        },
        {
          name: 'TERM_DEPOSIT_ADD',
          link: ''
        }
      ]
    }, 800)
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createTermDepositStore$.dispatch(new fromStore.CreateTermDepositReset());
    this.isLoading = false;
  }

  goToViewTermDeposit() {
    this.router.navigate(['/profiles', this.formComponent.profileType, this.formComponent.profileId, 'term-deposits']);
  }

  goToViewLoanDetails(id) {
    this.router.navigate(['term-deposits', `${id}`]);
  }

  submitForm() {
    if (this.formComponent.form.valid) {
      this.isLoading = true;
      this.disableSubmitBtn(true);
      const objectToSendCreate = Object.assign({}, this.formComponent.form.getRawValue(), {
        profileId: this.formComponent.profileId,
        createdDate: this.parseDateFormatService.parseDateValue(this.formComponent.form.controls['createdDate'].value) + moment().format(environment.TIME_FORMAT)
      });

      this.createTermDepositStore$.dispatch(new fromStore.CreateTermDeposit(objectToSendCreate));
    }
  }

  ngOnDestroy() {
    this.createTermDepositSub.unsubscribe();
  }
}

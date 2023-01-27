import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ITermDepositUpdateState } from '../../../core/store/term-deposit/term-deposit-update';
import { ITermDepositState } from '../../../core/store/term-deposit/term-deposit';
import { TermDepositSideNavService } from '../shared/services/term-deposit-side-nav.service';
import { TermDepositNewComponent } from '../term-deposit-new/term-deposit-new.component';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { ParseDateFormatService } from '../../../core/services';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom17',
  name: 'custom17'
};

@Component({
  selector: 'cbs-term-deposit-wrap-edit',
  templateUrl: 'term-deposit-wrap-edit.component.html'
})

export class TermDepositWrapEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(TermDepositNewComponent, {static: false}) formComponent: TermDepositNewComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public termDepositNavConfig = [];
  public breadcrumbLinks = [];
  public termDeposit: any;
  public routeSub: any;
  public termDepositSub: any;
  public termDepositState: any;
  private updateTermDepositSub: any;
  public formStatusChanged: any;

  constructor(private updateTermDepositStore$: Store<ITermDepositUpdateState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private parseDateFormatService: ParseDateFormatService,
              private termDepositSideNavService: TermDepositSideNavService,
              public termDepositStore$: Store<ITermDepositState>,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params && params.id) {
        this.termDepositStore$.dispatch(new fromStore.LoadTermDeposit(params.id));
      }
    });

    this.updateTermDepositSub = this.store$.pipe(select(fromRoot.getTermDepositUpdateState)).subscribe(
      (state: ITermDepositUpdateState) => {
        if (state.loaded && state.success && !state.error) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewTermDepositDetails(state.response.id);
        } else if (state.loaded && !state.success && state.error) {
          this.disableSubmitBtn(false);
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    this.termDepositSub = this.store$.pipe(select(fromRoot.getTermDepositState)).subscribe(
      (termDepositState: ITermDepositState) => {
        this.termDepositState = termDepositState;
        if (termDepositState.success && termDepositState.loaded && termDepositState.termDeposit) {
          this.termDeposit = termDepositState.termDeposit;
          this.formComponent.populateFields(this.termDeposit);
          const profileType = this.termDeposit.profileType === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: 'TERM_DEPOSITS',
              link: `/profiles/${profileType}/${this.termDeposit.profileId}/term-deposits`
            },
            {
              name: this.termDeposit.code,
              link: ''
            },
            {
              name: 'EDIT',
              link: ''
            }
          ];
          this.termDepositNavConfig = this.termDepositSideNavService.getNavList('term-deposits', {
            editMode: true,
            createMode: false,
            termDepositId: this.termDeposit.id,
            status: this.termDeposit.status
          });
        } else if (termDepositState.loaded && !termDepositState.success && termDepositState.error) {
          this.toastrService.error(`ERROR: ${termDepositState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.router.navigateByUrl('term-deposits');
        }
      });
  }

  ngAfterViewInit() {
    this.formComponent.form.valueChanges.pipe(debounceTime(300)).subscribe(newTermDepositData => {
      this.formStatusChanged = this.compareChanges(newTermDepositData, this.termDeposit);
    })
  }

  compareChanges(newTermDepositData, oldTermDepositData) {
    let status = false;
    for (const value in newTermDepositData) {
      if (newTermDepositData.hasOwnProperty(value)) {
        if (value === 'termDepositProductId') {
          if (newTermDepositData[value] !== oldTermDepositData.termDepositProductId) {
            status = true;
          }
        } else if (value === 'serviceOfficerId') {
          if (newTermDepositData[value] !== oldTermDepositData.serviceOfficerId) {
            status = true;
          }
        } else if (value === 'createdDate') {
          const oldDate = moment(oldTermDepositData.createdDate).format(environment.DATE_FORMAT_MOMENT);
          if (newTermDepositData.createdDate !== oldDate) {
            status = true;
          }
        } else {
          for (const k in oldTermDepositData) {
            if (oldTermDepositData.hasOwnProperty(k)) {
              if (value === k && newTermDepositData[value] != oldTermDepositData[k]) {
                status = true;
              }
            }
          }
        }
      }
    }
    return status;
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.updateTermDepositStore$.dispatch(new fromStore.UpdateTermDepositReset());
  }

  goToViewTermDepositDetails(id) {
    this.router.navigate(['term-deposits', `${id}`]);
  }

  submitForm() {
    if (this.formComponent.form.valid) {
      this.disableSubmitBtn(true);

      const objectToSendObject = Object.assign({}, this.formComponent.form.getRawValue(), {
        profileId: this.termDeposit.profileId,
        createdDate: this.parseDateFormatService.parseDateValue(this.formComponent.form.controls.createdDate.value) + moment().format(environment.TIME_FORMAT)
      });

      this.updateTermDepositStore$.dispatch(new fromStore.UpdateTermDeposit({
        id: this.termDeposit.id,
        data: objectToSendObject
      }));
    }
  }

  ngOnDestroy() {
    this.updateTermDepositSub.unsubscribe();
    this.termDepositSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.termDepositStore$.dispatch(new fromStore.ResetTermDeposit());
  }
}

import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ISavingCreateState } from '../../../core/store/saving/saving-create';
import { SavingSideNavService } from '../shared/services/saving-side-nav.service';
import { SavingNewComponent } from '../saving-new/saving-new.component';
import * as moment from 'moment';
import { ParseDateFormatService } from '../../../core/services';

const SVG_DATA = {
  collection: 'standard',
  class: 'case',
  name: 'case'
};

@Component({
  selector: 'cbs-saving-wrap-create',
  templateUrl: 'saving-wrap-create.component.html'
})

export class SavingWrapCreateComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  @ViewChild(SavingNewComponent, {static: true}) formComponent: SavingNewComponent;


  public svgData = SVG_DATA;
  public savingNavConfig = [];
  public profile: any;
  public isLoading = false;
  public breadcrumb = [];
  private createSavingSub: any;

  constructor(private createSavingStore$: Store<ISavingCreateState>,
              private router: Router,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private store$: Store<fromRoot.State>,
              private parseDateFormatService: ParseDateFormatService,
              private savingNavConfigSideNavService: SavingSideNavService) {
  }

  ngOnInit() {
    this.savingNavConfig = this.savingNavConfigSideNavService.getNavList('savings', {
      editMode: false,
      createMode: true
    });

    this.createSavingSub = this.store$.pipe(select(fromRoot.getSavingCreateState)).subscribe(
      (state: ISavingCreateState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewLoanDetails(state.response.id);
        } else if ( state.loaded && !state.success && state.error ) {
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
          name: 'SAVING',
          link: `/profiles/${this.formComponent.profileType}/${this.formComponent.profileId}/savings`
        },
        {
          name: 'SAVING_ADD',
          link: ''
        }
      ]
    }, 800)
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createSavingStore$.dispatch(new fromStore.CreateSavingReset());
    this.isLoading = false;
  }

  goToViewSaving() {
    this.router.navigate(['/profiles', this.formComponent.profileType, this.formComponent.profileId, 'savings']);
  }

  goToViewLoanDetails(id) {
    this.router.navigate(['savings', `${id}`]);
  }

  submitForm() {
    if ( this.formComponent.form.valid ) {
      this.isLoading = true;
      this.disableSubmitBtn(true);
      const objectToSendCreate = Object.assign({}, this.formComponent.form.getRawValue(), {
        profileId: this.formComponent.profileId,
        openDate: this.parseDateFormatService.parseDateValue(this.formComponent.form.controls['openDate'].value) + moment().format(environment.TIME_FORMAT)
      });

      this.createSavingStore$.dispatch(new fromStore.CreateSaving(objectToSendCreate));
    }
  }

  ngOnDestroy() {
    this.createSavingSub.unsubscribe();
  }
}

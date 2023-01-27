import { debounceTime } from 'rxjs/operators';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ISavingUpdateState } from '../../../core/store/saving/saving-update';
import { ISavingState } from '../../../core/store/saving/saving';
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
  selector: 'cbs-saving-wrap-edit',
  templateUrl: 'saving-wrap-edit.component.html'
})

export class SavingWrapEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(SavingNewComponent, {static: false}) formComponent: SavingNewComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public savingNavConfig = [];
  public breadcrumbLinks = [];
  public saving: any;
  public routeSub: any;
  public savingSub: any;
  public savingState: any;
  private updateSavingSub: any;
  public formStatusChanged: any;

  constructor(private updateSavingStore$: Store<ISavingUpdateState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private parseDateFormatService: ParseDateFormatService,
              private savingSideNavService: SavingSideNavService,
              public savingStore$: Store<ISavingState>,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.savingStore$.dispatch(new fromStore.LoadSaving(params.id));
      }
    });

    this.updateSavingSub = this.store$.pipe(select(fromRoot.getSavingUpdateState)).subscribe(
      (state: ISavingUpdateState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewSavingDetails(state.response.id);
        } else if ( state.loaded && !state.success && state.error ) {
          this.disableSubmitBtn(false);
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    this.savingSub = this.store$.pipe(select(fromRoot.getSavingState)).subscribe(
      (savingState: ISavingState) => {
        this.savingState = savingState;
        if ( savingState.success && savingState.loaded && savingState.saving ) {
          this.saving = savingState.saving;
          this.formComponent.populateFields(this.saving);
          const profileType = this.saving['profileType'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: 'SAVINGS',
              link: `/profiles/${profileType}/${this.saving['id']}/savings`
            },
            {
              name: this.saving['code'],
              link: ''
            },
            {
              name: 'EDIT',
              link: ''
            }
          ];
          this.savingNavConfig = this.savingSideNavService.getNavList('savings', {
            editMode: true,
            createMode: false,
            savingId: this.saving['id'],
            status: this.saving['status']
          });
        } else if ( savingState.loaded && !savingState.success && savingState.error ) {
          this.toastrService.error(`ERROR: ${savingState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.router.navigateByUrl('savings');
        }
      });
  }

  ngAfterViewInit() {
    this.formComponent.form.valueChanges.pipe(debounceTime(300)).subscribe(newSavingData => {
      this.formStatusChanged = this.compareChanges(newSavingData, this.saving);
    })
  }

  compareChanges(newSavingData, oldSavingData) {
    let status = false;
    for (const value in newSavingData) {
      if ( newSavingData.hasOwnProperty(value) ) {
        if ( value === 'savingProductId' ) {
          if ( newSavingData[value] !== oldSavingData['savingProductId'] ) {
            status = true;
          }
        } else if ( value === 'savingOfficerId' ) {
          if ( newSavingData[value] !== oldSavingData['savingOfficerId'] ) {
            status = true;
          }
        } else if ( value === 'openDate' ) {
          const oldDate = moment(oldSavingData['openDate']).format(environment.DATE_FORMAT_MOMENT);
          if ( newSavingData['openDate'] !== oldDate ) {
            status = true;
          }
        } else {
          for (const k in oldSavingData) {
            if ( oldSavingData.hasOwnProperty(k) ) {
              if ( value === k && newSavingData[value] != oldSavingData[k] ) {
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
    this.updateSavingStore$.dispatch(new fromStore.UpdateSavingReset());
  }

  goToViewSavingDetails(id) {
    this.router.navigate(['savings', `${id}`]);
  }

  submitForm() {
    if ( this.formComponent.form.valid ) {
      this.disableSubmitBtn(true);

      const objectToSendObject = Object.assign({}, this.formComponent.form.getRawValue(), {
        profileId: this.saving.profileId,
        openDate: this.parseDateFormatService.parseDateValue(this.formComponent.form.controls['openDate'].value) + moment().format(environment.TIME_FORMAT)
      });

      this.updateSavingStore$.dispatch(new fromStore.UpdateSaving({id: this.saving.id, data: objectToSendObject}));
    }
  }

  ngOnDestroy() {
    this.updateSavingSub.unsubscribe();
    this.savingSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.savingStore$.dispatch(new fromStore.ResetSaving());
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { environment } from '../../../../environments/environment';
import { ISavingState, SavingService } from '../../../core/store/saving/saving';
import { SavingSideNavService } from '../shared/services/saving-side-nav.service';


const SVG_DATA = {
  collection: 'standard',
  class: 'case',
  name: 'case'
};

@Component({
  selector: 'cbs-saving-wrap',
  templateUrl: 'saving-wrap.component.html',
  styleUrls: ['./saving-wrap.component.scss']
})

export class SavingWrapComponent implements OnInit, OnDestroy {
  public savingStatus: string;
  public breadcrumb = [];
  public svgData = SVG_DATA;
  public isLoading = false;
  public savingNavConfig = [];
  public saving: any;
  public opened = false;
  public fieldEmpty = false;
  public initialAmount: any;
  public savingState: any;
  public savingProductInitialAmountMin: any;
  public savingProductInitialAmountMax: any;

  private routeSub: any;
  private savingSub: any;

  constructor(public savingStore$: Store<ISavingState>,
              public route: ActivatedRoute,
              public savingSideNavService: SavingSideNavService,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public store$: Store<fromRoot.State>,
              private savingService: SavingService,
              public router: Router) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      this.saving = params;
      if ( params && params.id ) {
        this.savingStore$.dispatch(new fromStore.LoadSaving(params.id));
      }
    });

    this.savingSub = this.savingStore$.select(fromRoot.getSavingState).subscribe(
      (savingState: ISavingState) => {
        this.savingState = savingState;
        if ( savingState.loaded && savingState.success && savingState.saving ) {
          this.breadcrumb = savingState['breadcrumb'];
          this.saving = savingState.saving;
          this.savingStatus = this.saving['status'];
          this.savingProductInitialAmountMin = this.saving.savingProductInitialAmountMin;
          this.savingProductInitialAmountMax = this.saving.savingProductInitialAmountMax;
          this.savingNavConfig = this.savingSideNavService.getNavList('savings', {
            savingId: this.saving['id'],
            editMode: false,
            createMode: false,
            status: this.saving['status']
          });
          this.isLoading = false;

        } else if ( savingState.loaded && !savingState.success && savingState.error ) {
          this.toastrService.error(`ERROR: ${savingState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.isLoading = false;
          this.router.navigateByUrl('savings');
        }
      })
  }

  openModal() {
    this.opened = true;
    this.fieldEmpty = true;
  }

  closeModal() {
    this.opened = false;
    this.initialAmount = '';
  }

  resetState() {
    this.savingStore$.dispatch(new fromStore.ResetSaving());
  }

  sendSaving() {
    this.savingService.openSaving(this.saving.id, this.initialAmount).subscribe(data => {
      if ( data.error ) {
        this.toastrService.clear();
        this.toastrService.error(`ERROR: ${data['message']}`, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.opened = false;
        this.translate.get('OPEN_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.savingStore$.dispatch(new fromStore.LoadSaving(this.saving.id));
      }
    })
  }

  checkField() {
    this.fieldEmpty = this.initialAmount === null;
  }

  ngOnDestroy() {
    this.savingSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.savingStore$.dispatch(new fromStore.ResetSaving());
  }
}

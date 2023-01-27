import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';
import {
  CreditLineUpdateService,
  ICreateCreditLine, ICreditLine,
  IProfile,
  IUpdateCreditLine,
} from '../../../../../core/store';
import { Subscription } from 'rxjs';
import { CreditLineFormComponent } from '../shared/credit-line-form/credit-line-form.component';

const SVG_DATA = {collection: 'standard', class: 'calibration', name: 'calibration'};

@Component({
  selector: 'cbs-credit-line-edit',
  templateUrl: 'credit-line-edit.component.html',
  styleUrls: ['credit-line-edit.component.scss']
})
export class CreditLineEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CreditLineFormComponent, {static: false}) creditLineForm: CreditLineFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public isOpen = false;
  public formChanged = false;
  public cachedPenalties = [];
  public cachedAccountList: any;
  public breadcrumb = [];
  public profile: any;
  public creditLine: any;
  public profileId: number;
  public profileType: string;
  public creditLineId: number;

  private profileSub: Subscription;
  private cachedCreditLine: any;
  private routeSub: Subscription;
  private creditLineUpdateSub: Subscription;
  private creditLineSub: Subscription;

  constructor(private creditLineUpdateStore$: Store<IUpdateCreditLine>,
              private router: Router,
              private creditLineStore$: Store<ICreateCreditLine>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private profileStore$: Store<IProfile>,
              private creditLineUpdateService: CreditLineUpdateService,
              private toasterService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];
    });

    this.creditLineSub = this.store$.pipe(select(fromRoot.getCreditLineState))
      .subscribe(
        (creditLineState: ICreditLine) => {
          if ( creditLineState.loaded && creditLineState.success ) {
            this.creditLineId = creditLineState.creditLine['id'];
            this.cachedCreditLine = creditLineState.creditLine;
            this.cachedCreditLine['penalties'].map(penalty => {
              this.cachedPenalties.push(penalty);
            });

            setTimeout(() => {
              if ( this.creditLineForm && this.creditLineForm.form ) {
                this.creditLineForm.populateFields(this.cachedCreditLine);
                this.creditLineForm.selectedPenalties = this.cachedCreditLine['penalties'];
              }
            });
          }
        });

    this.profileSub = this.profileStore$.select(fromRoot.getProfileState)
      .subscribe(profile => {
        if ( profile ) {
          this.breadcrumb = [
            {
              name: 'PROFILES',
              link: `/profiles`
            },
            {
              name: profile['name'],
              link: `/profiles/${this.profileType}/${this.profileId}/info`
            },
            {
              name: 'CREDIT_LINES',
              link: `/profiles/${this.profileType}/${this.profileId}/credit-line-list`
            },
            {
              name: 'CREDIT_LINE',
              link: `/profiles/${this.profileType}/${this.profileId}/credit-line/${this.creditLineId}`
            },
            {
              name: 'CREDIT_LINE_UPDATE',
              link: ''
            }
          ];
        }
      });

    this.creditLineUpdateSub = this.creditLineUpdateStore$.pipe(select(fromRoot.getCreditLineUpdateState))
      .subscribe((creditLineUpdateState: IUpdateCreditLine) => {
        if ( creditLineUpdateState.loaded && creditLineUpdateState.success && !creditLineUpdateState.error ) {
          this.resetState();
          this.goToViewCreditLine();
        } else if ( creditLineUpdateState.loaded && !creditLineUpdateState.success && creditLineUpdateState.error ) {
          this.disableSubmitBtn(false);
          this.resetState();
        }
      });
  }

  goToViewCreditLine() {
    this.router.navigate(['/profiles', this.profileType, this.profileId, 'credit-line', this.creditLineId]);
  }

  resetState() {
    this.creditLineUpdateStore$.dispatch(new fromStore.UpdateCreditLineReset());
  };

  ngAfterViewInit() {
    if ( this.creditLineForm && this.creditLineForm.form ) {
      this.creditLineForm.form.valueChanges.subscribe(data => {
        this.formChanged = (this.checkFormChanges(data, this.cachedCreditLine));
      });
    }
  }

  submitForm() {
    if ( this.creditLineForm.form.valid ) {
      this.creditLine = Object.assign({}, this.creditLineForm.form.value);
      const penaltiesIdToSend = [];
      this.creditLineForm.selectedPenalties.map(penalty => {
        penaltiesIdToSend.push(penalty.id);
      });
      this.creditLine.penalties = penaltiesIdToSend;
      this.creditLine.profileId = this.profileId;

      this.creditLineUpdateService.updateCreditLine(this.creditLine, this.creditLineId)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toasterService.clear();
            this.toasterService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toasterService.clear();
            this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
              this.toasterService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/profiles', this.profileType, this.profileId, 'credit-line', res.id]);
            this.creditLineStore$.dispatch(new fromStore.LoadCreditLine(res.id));
          }
        });
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.creditLineUpdateSub.unsubscribe();
  }

  checkFormChanges(creditLineData, cachedData) {
    let status = false;
    if ( creditLineData ) {
      for (const key in creditLineData) {
        if ( creditLineData.hasOwnProperty(key) ) {
          if ( key === 'loanProductId' ) {
            if ( creditLineData[key] && !cachedData['loanProduct'] ) {
              status = true;
            }
            if ( cachedData['loanProduct'] && creditLineData[key] !== cachedData['loanProduct']['id'] ) {
              status = true;
            }
          } else {
            for (const k in cachedData) {
              if ( cachedData.hasOwnProperty(k) ) {
                if ( key === k && creditLineData[key] !== cachedData[k] ) {
                  status = true;
                }
              }
            }
          }
        }
      }
    }
    return status;
  }

  changePenaltiesValue() {
    if ( this.creditLineForm.selectedPenalties.length === this.cachedPenalties.length ) {
      const cachedIds = this.getIds(this.cachedPenalties).sort();
      const selectedIds = this.getIds(this.creditLineForm.selectedPenalties).sort();
      if ( cachedIds.length === selectedIds.length && cachedIds.every((v, i) => v === selectedIds[i]) ) {
        this.formChanged = false;
      }
    } else {
      this.formChanged = true;
    }
  }

  getIds(array) {
    return array.map((x) => {
      return x['id'];
    });
  }
}

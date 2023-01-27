import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromRoot from '../../../../core/core.reducer';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import { ITermDepositState } from '../../../../core/store';
import { environment } from '../../../../../environments/environment';
import { TermDepositService } from '../../../../core/store/term-deposit/term-deposit';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ActualizeTermDepositService } from '../../shared/services/actualize-term-deposit.service';
import { ParseDateFormatService } from '../../../../core/services';

@Component({
  selector: 'cbs-special-operations',
  templateUrl: 'special-operations.component.html',
  styleUrls: ['special-operations.component.scss']
})

export class TermDepositSpecialOperationComponent implements OnInit, OnDestroy {
  private termDepositSub: any;
  public breadcrumb = [];
  public termDepositId: number;
  public termDepositData: any;
  public locked: boolean;
  public status: boolean;
  public title: string;
  public closeTermDeposit = false;
  public lock = false;
  public isOpenActualize = false;
  public actualizeDate: any;
  public closeDate: any;
  public isLoading = false;
  public lockIcon = {collection: 'custom', name: 'custom77', className: 'custom77'};
  public unlockIcon = {collection: 'standard', name: 'task2', className: 'task2'};
  public closeIcon = {collection: 'action', name: 'close', className: 'close'};
  public actualizeIcon = {collection: 'standard', name: 'announcement', className: 'announcement'};

  constructor(private termDepositStore$: Store<ITermDepositState>,
              private termDepositService: TermDepositService,
              public toastrService: ToastrService,
              public parseDateFormatService: ParseDateFormatService,
              private actualizeService: ActualizeTermDepositService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.termDepositSub = this.termDepositStore$.pipe(select(fromRoot.getTermDepositState))
      .subscribe((termDepositState: ITermDepositState) => {
        if ( termDepositState['loaded'] && !termDepositState['error'] && termDepositState['success'] ) {
          this.termDepositData = termDepositState.termDeposit;
          this.status = this.termDepositData.status === 'OPEN';
          this.locked = this.termDepositData.locked;
          this.termDepositId = this.termDepositData.id;
          const profileType = this.termDepositData.profileType === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: this.termDepositData.profileName,
              link: `/profiles/${profileType}/${this.termDepositData.profileId}/info`
            },
            {
              name: 'TERM_DEPOSITS',
              link: `/profiles/${profileType}/${this.termDepositData.profileId}/term-deposits`
            },
            {
              name: 'OPERATIONS',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.termDepositStore$.dispatch(new fromStore.SetTermDepositBreadcrumb(this.breadcrumb));
    }, 1500);
  }

  openActualizeModal() {
    this.isOpenActualize = true;
    this.actualizeDate = moment().format(environment.DATE_FORMAT_MOMENT);
  }

  closeTermDepositModal() {
    this.closeTermDeposit = true;
    this.closeDate = moment().format(environment.DATE_FORMAT_MOMENT);
    this.title = 'CLOSE_TERM_DEPOSIT';
  }

  submitActualize() {
    this.isOpenActualize = false;
    this.isLoading = true;
    this.actualizeDate = this.parseDateFormatService.parseDateValue(this.actualizeDate);
    this.actualizeService.actualizeTermDeposit(this.termDepositId, this.actualizeDate).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(null, res.message, environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get('SUCCESS').subscribe((translation: string) => {
          this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.termDepositStore$.dispatch(new fromStore.LoadTermDeposit(this.termDepositId));
        this.isLoading = false;
      }
    });
  }

  openLockUnlockPopup() {
    this.lock = true;
  }

  closeModal() {
    this.isOpenActualize = false;
    this.lock = false;
    this.closeTermDeposit = false;
  }

  submitLockUnlockTermDeposit() {
    this.isLoading = true;
    this.termDepositService.lockAndUnlockTermDeposit(this.termDepositId).subscribe(data => {
      if ( data.error ) {
        this.toastrService.clear();
        this.toastrService.error(`ERROR: ${data.message}`, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get(this.locked ? 'UNLOCK_SUCCESS' : 'LOCK_SUCCESS').subscribe((res: string) => {
          this.toastrService.clear();
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.termDepositStore$.dispatch(new fromStore.LoadTermDeposit(this.termDepositId));
        this.isLoading = false;
      }
    })
  }

  submitCloseTermDeposit() {
    this.isLoading = true;
    this.closeDate = this.parseDateFormatService.parseDateValue(this.closeDate);
    this.termDepositService.closeTermDeposit(this.termDepositId, this.closeDate).subscribe(data => {
      if ( data.error ) {
        this.toastrService.clear();
        this.toastrService.error(`ERROR: ${data.message}`, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.closeTermDeposit = false;
        this.translate.get('CLOSE_SUCCESS').subscribe((res: string) => {
          this.toastrService.clear();
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.termDepositStore$.dispatch(new fromStore.LoadTermDeposit(this.termDepositId));
        this.isLoading = false;
      }
    })
  }

  ngOnDestroy() {
    this.termDepositSub.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromStore from '../../../core/store';
import { ILoanEvents, ILoanInfo, LOAN_EVENTS_SUCCESS, LoanEventsSuccess } from '../../../core/store';
import * as LoanEventsActions from '../../../core/store/loans/loan-events'
import { LoanEventsService } from '../../../core/store/loans/loan-events'
import { RollbackService } from '../shared/services/rollback.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import * as fromRoot from '../../../core/core.reducer';
import * as FileSaver from 'file-saver';
import { PrintOutService, } from '../../../core/services';
import { Table } from 'primeng/table';
import * as moment from 'moment';
import { LoanAttachmentsExtraService } from '../shared/services/loan-attachments-extra.service';
import {Actions, ofType} from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cbs-loan-events',
  templateUrl: 'loan-events.component.html',
  styleUrls: ['./loan-events.component.scss']
})

export class LoanEventsComponent implements OnInit, OnDestroy {
  @ViewChild('dt', {static: false}) dataTable: Table;
  public events: any;
  public breadcrumb = [];
  public isRollbackConfirmOpen = false;
  public showDeleted = false;
  public showSystem = false;
  public isLoading = false;
  public receiptFormId: number;
  public eventsState: any;
  public rollbackForm: FormGroup;

  private loanId: number;
  private loanType: string;
  private rollbackSub: Subscription;
  private routeSub: Subscription;
  private eventsSub: Subscription;
  private loanSub: Subscription;
  private actionSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private loanStore$: Store<ILoanInfo>,
              private rollbackService: RollbackService,
              private loanEventsStore$: Store<ILoanEvents>,
              private toastrService: ToastrService,
              private fb: FormBuilder,
              private translate: TranslateService,
              private printingFormService: PrintOutService,
              private loanExtraService: LoanAttachmentsExtraService,
              private loanEventsService: LoanEventsService,
              private actions$: Actions) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe((params: { id, loanType }) => {
      if ( params && params.id ) {
        this.loanId = params.id;
        this.loanType = params.loanType;
        this.loanEventsStore$
          .dispatch(new LoanEventsActions.LoadLoanEvents({id: this.loanId}));
      }
    });

    this.eventsSub = this.store$.pipe(select(fromRoot.getLoanEventsState)).subscribe(
      (eventsState: ILoanEvents) => {
        this.eventsState = eventsState;
        if ( eventsState.loaded && eventsState.success && !eventsState.error ) {
          this.events = eventsState.loanEvents.map(event => {
            return Object.assign({}, event, {
              expanded: false,
              childNotes: []
            });
          });
        }
      });

    this.rollbackForm = this.fb.group({
      comment: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });

    this.printingFormService.getForms('LOAN_EVENT').subscribe(res => {
      if ( res.err ) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.receiptFormId = res[0]['id'];
      }
    });

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState)).subscribe((loanState: ILoanInfo) => {
      if ( loanState.loaded && loanState.loan && loanState.loan['status'] === LoanAppStatus[LoanAppStatus.PENDING] ) {
        this.router.navigate(['/loan-applications']);
      }
      if ( loanState.loaded && !loanState.error && loanState.success ) {
        const loanProfile = loanState.loan['profile'];
        const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
        this.breadcrumb = [
          {
            name: loanProfile['name'],
            link: `/profiles/${profileType}/${loanProfile['id']}/info`
          },
          {
            name: 'LOANS',
            link: '/loans'
          },
          {
            name: loanState.loan['code'],
            link: ''
          },
          {
            name: 'EVENTS',
            link: ''
          }
        ];
      }
    });

    this.rollbackSub = this.rollbackService.getRollbackStatus().subscribe(status => {
      this.isRollbackConfirmOpen = status;
      const dateNow = moment().format(environment.DATE_FORMAT_MOMENT);
      this.rollbackForm.controls['date'].setValue(dateNow);
    });

    setTimeout(() => {
      this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 1000);

    this.loanExtraService.showDeletedEventsSourceChange$.subscribe(status => {
      if ( status ) {
        this.showDeleted = !this.showDeleted;
        this.showEvents();
      }
    });

    this.loanExtraService.showSystemEventsSourceChange$.subscribe(status => {
      if ( status ) {
        this.showSystem = !this.showSystem;
        this.showEvents();
      }
    });

    this.actionSub = this.actions$.pipe(ofType(LOAN_EVENTS_SUCCESS)).subscribe((action: LoanEventsSuccess) => {
      if ( action.payload.length === 0 ) {
        this.router.navigate(['/loan-applications']);
      } else {
        this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId, loanType: this.loanType}));
      }
    });
  }

  onEventClick(event) {
    this.isLoading = true;
    this.loanEventsService.getChildNotes(this.loanId, event['groupKey']).subscribe(res => {
      event.childNotes = res;
      this.dataTable.toggleRow(event);
      event.expanded = !event.expanded;
      this.isLoading = false;
    });
  }

  resetState() {
    this.loanEventsStore$.dispatch(new fromStore.LoanEventsReset());
  }

  rowStyleClass(row) {
    return row.deleted ? 'is-deleted' : '';
  }

  download(event) {
    const createdAtDate = moment(event['createdAt']).format('YYYY-MM-DDTHH:mm:ss');
    this.isLoading = true;
    const objToSend = {
      entityId: event['groupKey'],
      templateId: this.receiptFormId
    };

    this.printingFormService.downloadForm(objToSend, 'LOAN_EVENT').subscribe(res => {
      if ( res.err ) {
        this.translate.get('CREATE_ERROR').subscribe((response: string) => {
          this.toastrService.error(res.err, response, environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
        FileSaver.saveAs(res, `Cash_receipt_${createdAtDate}.docx`)
      }
    })
  }

  closeModal() {
    this.isRollbackConfirmOpen = false;
    this.rollbackForm.reset();
  }

  confirmRollback() {
    this.isLoading = true;
    const dateNow = moment(this.rollbackForm.controls['date'].value).format(environment.DATE_FORMAT_MOMENT);
    this.rollbackForm.controls['date'].setValue(dateNow);
    this.rollbackService.rollBack(this.loanId, this.rollbackForm.value).subscribe(res => {
      if ( res['error'] ) {
        this.toastrService.clear();
        this.toastrService.success(res['message'], '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get('ROLLBACK_SUCCESS').subscribe((m: string) => {
          this.toastrService.success(m, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.loanEventsStore$.dispatch(new LoanEventsActions.LoadLoanEvents({id: this.loanId}));
      }
      this.isLoading = false;
      this.rollbackForm.reset();
    });
    this.isRollbackConfirmOpen = false;
  }

  showEvents() {
    this.loanEventsStore$.dispatch(new LoanEventsActions.LoadLoanEvents({
      id: this.loanId,
      status: {showDeleted: this.showDeleted, showSystem: this.showSystem}
    }));
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.eventsSub.unsubscribe();
    this.loanSub.unsubscribe();
    this.rollbackSub.unsubscribe();
    this.actionSub.unsubscribe();
  }
}

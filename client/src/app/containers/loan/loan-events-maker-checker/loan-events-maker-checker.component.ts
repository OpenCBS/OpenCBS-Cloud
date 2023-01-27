import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromStore from '../../../core/store';
import { ILoanEvents, ILoanInfo } from '../../../core/store';
import * as LoanEventsActions from '../../../core/store/loans/loan-events'
import { LoanEventsService } from '../../../core/store/loans/loan-events'
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import * as fromRoot from '../../../core/core.reducer';
import { Table } from 'primeng/table';
import { LoanAttachmentsExtraService } from '../shared/services/loan-attachments-extra.service';
import { CCRulesFormComponent } from '../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-loan-events-maker-checker',
  templateUrl: 'loan-events-maker-checker.component.html',
  styleUrls: ['./loan-events-maker-checker.component.scss']
})

export class LoanEventsMakerCheckerComponent implements OnInit, OnDestroy {
  @ViewChild('dt', {static: false}) dataTable: Table;
  public events: any;
  public breadcrumb = [];
  public showDeleted = false;
  public showSystem = false;
  public isLoading = false;
  public eventsState: any;

  private loanSub: any;
  private loanId: number;
  private eventsSub: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private loanStore$: Store<ILoanInfo>,
              private loanEventsStore$: Store<ILoanEvents>,
              public toastrService: ToastrService,
              public translate: TranslateService,
              private loanExtraService: LoanAttachmentsExtraService,
              public loanEventsService: LoanEventsService) {
  }

  ngOnInit() {
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

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState)).subscribe((loanState: ILoanInfo) => {
      if ( loanState.loaded && loanState.loan && loanState.loan['status'] === LoanAppStatus[LoanAppStatus.PENDING] ) {
        this.router.navigate(['/loan-applications']);
      }
      if ( loanState.loaded && !loanState.error && loanState.success ) {
        const loanProfile = loanState.loan['profile'];
        this.loanId = loanState.loan['id'];
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
            link: `/loans/${this.loanId}/${profileType}/info`
          },
          {
            name: 'MAKER/CHECKER ROLLBACK',
            link: ''
          }
        ];
      }
    });

    setTimeout(() => {
      this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 1500);

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
    })
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

  showEvents() {
    this.loanEventsStore$.dispatch(new LoanEventsActions.LoadLoanEvents({
      id: this.loanId,
      status: {showDeleted: this.showDeleted, showSystem: this.showSystem}
    }));
  }

  ngOnDestroy() {
    this.resetState();
    this.eventsSub.unsubscribe();
    this.loanSub.unsubscribe();
  }
}

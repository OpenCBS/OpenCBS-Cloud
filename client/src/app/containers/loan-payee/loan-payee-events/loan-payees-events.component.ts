import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromStore from '../../../core/store';
import { ILoanInfo, ILoanPayee } from '../../../core/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import { Table } from 'primeng/table';
import { LoanPayeeEventsService, LoanPayeeEventsState } from '../../../core/store/loan-payees/loan-payees-events'
import * as LoanPayeeEventsActions from '../../../core/store/loan-payees/loan-payees-events/loan-payee-events.actions'

@Component({
  selector: 'cbs-loan-payees-events',
  templateUrl: 'loan-payees-events.component.html',
  styleUrls: ['./loan-payees-events.component.scss']
})

export class LoanPayeesEventsComponent implements OnInit, OnDestroy {
  @ViewChild('dt', {static: false}) dataTable: Table;
  public events: any;
  public breadcrumb = [];
  public loanPayee: any;
  public payeeName: any;
  public isLoading = false;
  public payeeEventsState: any;
  public loanPayeeInfoState: any;

  private payeeId: number;
  private routeSub: any;
  private eventsSub: any;
  private loanPayeeSub: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private loanStore$: Store<ILoanInfo>,
              private loanPayeeStore$: Store<ILoanPayee>,
              private loanPayeeEventsStore$: Store<LoanPayeeEventsState>,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public loanPayeeEventsService: LoanPayeeEventsService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe((params: { id })  => {
      if (params && params.id) {
        this.payeeId = params.id;
        this.loanPayeeEventsStore$
        .dispatch(new LoanPayeeEventsActions.LoanPayeeEvents({
          id: this.payeeId
        }));
      }
    });

    this.eventsSub = this.store$.pipe(select(fromRoot.getLoanPayeeEventsState)).subscribe(
      (payeeEventsState: LoanPayeeEventsState) => {
        this.payeeEventsState = payeeEventsState;
        if (payeeEventsState.loaded && payeeEventsState.success && !payeeEventsState.error) {
          this.events = payeeEventsState.loanPayeeEvents.map(event => {
            const newEvent = Object.assign({}, event, {
              expanded: false,
              childNotes: []
            });
            return newEvent;
          });
        }
      });

    this.loanPayeeSub = this.store$.pipe(select(fromRoot.getLoanPayeeState)).subscribe(
      (loanPayeeState: ILoanPayee) => {
        if (loanPayeeState.loaded && loanPayeeState.success && loanPayeeState.payee) {
          this.loanPayeeInfoState = loanPayeeState;
          this.loanPayee = loanPayeeState.payee;
          this.payeeId = this.loanPayee['id'];
          this.payeeName = this.loanPayee['payeeName'];
          this.breadcrumb = [
            {
              name: 'PAYEES',
              link: ''
            },
            {
              name: this.payeeName,
              link: `/payees/${this.payeeId}/events`
            },
            {
              name: 'EVENTS',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.loanPayeeStore$.dispatch(new fromStore.SetLoanPayeeBreadcrumb(this.breadcrumb))
    }, 1000);
  }

  onEventClick(event) {
    this.isLoading = true;
    this.loanPayeeEventsService.getChildNotes(this.payeeId, event['groupKey']).subscribe(res => {
      event.childNotes = res;
      this.dataTable.toggleRow(event);
      event.expanded = !event.expanded;
      this.isLoading = false;
    });
  }

  resetState() {
    this.loanPayeeEventsStore$.dispatch(new fromStore.LoanPayeeEventsReset());
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.eventsSub.unsubscribe();
  }
}

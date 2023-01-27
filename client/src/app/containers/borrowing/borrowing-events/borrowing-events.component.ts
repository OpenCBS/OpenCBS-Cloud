import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromStore from '../../../core/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import {
  IBorrowingEvents,
  IBorrowingState,
  BorrowingEventsActions
} from '../../../core/store/borrowings';
import * as fromRoot from '../../../core/core.reducer';
import { BorrowingEventsService } from '../../../core/store/borrowings/borrowing-events';
import { Table } from 'primeng/table';
import { BorrowingFormExtraService } from '../shared/services/borrowing-extra.service';
import { environment } from '../../../../environments/environment';
import { BorrowingRollbackService } from '../shared/services/borrowing-rollback.service';

@Component({
  selector: 'cbs-borrowing-events',
  templateUrl: 'borrowing-events.component.html',
  styleUrls: ['./borrowing-events.component.scss']
})

export class BorrowingEventsComponent implements OnInit, OnDestroy {
  @ViewChild('dt', {static: false}) dataTable: Table;
  public events: any;
  public breadcrumb = [];
  private borrowingId: number;
  public isLoading = false;
  public eventsState: any;
  public showDeleted = false;
  public showSystem = false;
  public isRollbackConfirmOpen = false;
  private borrowingSub: any;
  private eventsSub: any;
  private routeSub: any;
  private rollbackSub: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private borrowingStore$: Store<IBorrowingState>,
              private borrowingEventsActions: BorrowingEventsActions,
              private borrowingEventsStore$: Store<IBorrowingEvents>,
              private borrowingExtraService: BorrowingFormExtraService,
              public toastrService: ToastrService,
              private rollbackService: BorrowingRollbackService,
              public translate: TranslateService,
              public borrowingEventsService: BorrowingEventsService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe((params: { id }) => {
      if (params && params.id) {
        this.borrowingId = params.id;
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId
        }));
      }
    });

    this.eventsSub = this.store$.select(fromRoot.getBorrowingEventsState).subscribe(
      (eventsState: IBorrowingEvents) => {
        this.eventsState = eventsState;
        if (eventsState.loaded && eventsState.success && !eventsState.error) {
          this.events = eventsState.data.map(event => {
            const newEvent = Object.assign({}, event, {
              expanded: false,
              childNotes: []
            });
            return newEvent;
          });
        }
      });

    this.borrowingSub = this.borrowingStore$.select(fromRoot.getBorrowingState).subscribe(
      (borrowingState: IBorrowingState) => {
        if (borrowingState['loaded'] && !borrowingState['error'] && borrowingState['success']) {
          const borrowingProfile = borrowingState['borrowing']['profile'];
          const profileType = borrowingProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: borrowingProfile['name'],
              link: `/profiles/${profileType}/${borrowingProfile['id']}/info`
            },
            {
              name: 'BORROWINGS',
              link: `/profiles/${profileType}/${borrowingProfile['id']}/borrowings`
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
    });

    setTimeout(() => {
      this.borrowingStore$.dispatch(new fromStore.SetBorrowingBreadcrumb(this.breadcrumb));
    }, 700);

    this.borrowingExtraService.showDeletedEventsSourceChange$.subscribe(status => {
      if (status) {
        this.showDeletedEvents();
      }
    });

    this.borrowingExtraService.showSystemEventsSourceChange$.subscribe(status => {
      if (status) {
        this.showSystemEvents();
      }
    })
  }

  onEventClick(event) {
    this.isLoading = true;
    this.borrowingEventsService.getChildNotes(this.borrowingId, event['groupKey']).subscribe(res => {
      event.childNotes = res;
      this.dataTable.toggleRow(event);
      event.expanded = !event.expanded;
      this.isLoading = false;
    });
  }

  resetState() {
    this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireResetAction());
  }

  rowStyleClass(row) {
    return row.deleted ? 'is-deleted' : '';
  }

  confirmRollback(message: any) {
    this.rollbackService.borrowingRollBack(this.borrowingId, {comment: message.note}).subscribe(res => {
      if (res.error) {
        this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.translate.get('ROLLBACK_SUCCESS').subscribe((m: string) => {
          this.toastrService.success(m, '', environment.SUCCESS_TOAST_CONFIG);
        });
        if (res['status'] === 'PENDING') {
          this.router.navigate([`/borrowings/${this.borrowingId}/info`]);
          this.borrowingStore$.dispatch(new fromStore.LoadBorrowing(this.borrowingId));
        } else {
          this.borrowingStore$.dispatch(new fromStore.LoadBorrowing(this.borrowingId));
          this.borrowingEventsStore$
          .dispatch(this.borrowingEventsActions.fireInitialAction({id: this.borrowingId}));
        }
      }
    });
    this.isRollbackConfirmOpen = false;
  }

  showDeletedEvents() {
    this.showDeleted = !this.showDeleted;
    if (this.showDeleted) {
      if (this.showSystem) {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: true, showSystem: true}
        }))
      } else {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: true, showSystem: false}
        }))
      }
    } else {
      if (this.showSystem) {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: false, showSystem: true}
        }))
      } else {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: false, showSystem: false}
        }))
      }
    }
  }

  showSystemEvents() {
    this.showSystem = !this.showSystem;
    if (this.showSystem) {
      if (this.showDeleted) {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: true, showSystem: true}
        }))
      } else {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: false, showSystem: true}
        }))
      }
    } else {
      if (this.showDeleted) {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: true, showSystem: false}
        }))
      } else {
        this.borrowingEventsStore$.dispatch(this.borrowingEventsActions.fireInitialAction({
          id: this.borrowingId,
          status: {showDeleted: false, showSystem: false}
        }))
      }
    }
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.eventsSub.unsubscribe();
    this.borrowingSub.unsubscribe();
    this.rollbackSub.unsubscribe();
  }

}

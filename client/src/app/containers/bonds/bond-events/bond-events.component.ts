import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromStore from '../../../core/store';
import { BondEventsService, BondState } from '../../../core/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import { DataTable } from 'primeng/primeng';
import { BondFormExtraService } from '../shared/services/bond-extra.service';
import { BondEventsState } from '../../../core/store/bond/bond-events';
import * as BondEventsActions from '../../../core/store/bond/bond-events/bond-events.actions';
import { BondRollbackService } from '../shared/services/bond-rollback.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cbs-bond-events',
  templateUrl: 'bond-events.component.html',
  styleUrls: ['./bond-events.component.scss']
})

export class BondEventsComponent implements OnInit, OnDestroy {
  @ViewChild('dt', {static: false}) dataTable: DataTable;
  public events: any;
  public breadcrumb = [];
  public isLoading = false;
  public eventsState: any;
  public showDeleted = false;
  public showSystem = false;
  public isRollbackConfirmOpen = false;

  private bondId: number;
  private bondSub: any;
  private eventsSub: any;
  private routeSub: any;
  private rollbackSub: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private bondStore$: Store<BondState>,
              private bondEventsStore$: Store<BondEventsState>,
              private bondExtraService: BondFormExtraService,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public bondEventsService: BondEventsService,
              private rollbackService: BondRollbackService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params
      .subscribe((params: { id }) => {
        if ( params && params.id ) {
          this.bondId = params.id;
          this.bondEventsStore$.dispatch(new BondEventsActions.BondEvents({
            id: this.bondId
          }));
        }
      });

    this.eventsSub = this.store$.select(fromRoot.getBondEventsState)
      .subscribe(
        (eventsState: BondEventsState) => {
          this.eventsState = eventsState;
          if ( eventsState.loaded && eventsState.success && !eventsState.error ) {
            this.events = eventsState.bondEvents.map(event => {
              return Object.assign({}, event, {
                expanded: false,
                childNotes: []
              });
            });
          }
        });

    this.bondSub = this.bondStore$.select(fromRoot.getBondState).subscribe(
      (bondState: BondState) => {
        if ( bondState['loaded'] && !bondState['error'] && bondState['success'] ) {
          const bondProfile = bondState['bond']['profile'];
          const profileType = bondProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: bondProfile['name'],
              link: `/profiles/${profileType}/${bondProfile['id']}/info`
            },
            {
              name: 'BONDS',
              link: `/profiles/${profileType}/${bondProfile['id']}/bonds`
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
      this.bondStore$.dispatch(new fromStore.SetBondBreadcrumb(this.breadcrumb));
    }, 700);

    this.bondExtraService.showDeletedEventsSourceChange$.subscribe(status => {
      this.showDeleted = status;
      this.bondEventsStore$.dispatch(new BondEventsActions.BondEvents({
        id: this.bondId,
        status: {showDeleted: this.showDeleted, showSystem: this.showSystem}
      }))
    });

    this.bondExtraService.showSystemEventsSourceChange$.subscribe(status => {
      this.showSystem = status;
      this.bondEventsStore$.dispatch(new BondEventsActions.BondEvents({
        id: this.bondId,
        status: {showDeleted: false, showSystem: this.showSystem}
      }))
    })
  }

  onEventClick(event) {
    this.isLoading = true;
    this.bondEventsService.getChildNotes(this.bondId, event['groupKey']).subscribe(res => {
      event.childNotes = res;
      this.dataTable.toggleRow(event);
      event.expanded = !event.expanded;
      this.isLoading = false;
    });
  }

  resetState() {
    this.bondEventsStore$.dispatch(new fromStore.BondEventsReset());
  }

  rowStyleClass(row) {
    return row.deleted ? 'is-deleted' : '';
  }

  confirmRollback(message: any) {
    this.rollbackService.bondRollBack(this.bondId, {comment: message.note})
      .subscribe((res) => {
        if ( res.error ) {
          this.toastrService.clear();
          this.toastrService.error(null, res.message, environment.ERROR_TOAST_CONFIG);
        } else {
          this.translate.get('ROLLBACK_SUCCESS').subscribe((m: string) => {
            this.toastrService.success(m, '', environment.SUCCESS_TOAST_CONFIG);
          });
          if ( res === 'IN_PROGRESS' ) {
            this.router.navigate([`/bonds/${this.bondId}/info`]);
            this.bondStore$.dispatch(new fromStore.LoadBond(this.bondId));
          } else {
            this.bondStore$.dispatch(new fromStore.LoadBond(this.bondId));
            this.bondEventsStore$.dispatch(new BondEventsActions.BondEvents({
              id: this.bondId
            }));
          }
        }
      });
    this.isRollbackConfirmOpen = false;
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.eventsSub.unsubscribe();
    this.bondSub.unsubscribe();
  }
}

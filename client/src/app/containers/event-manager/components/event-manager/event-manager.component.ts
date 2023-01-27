import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Event } from '../event.model';
import { ManageEventModalComponent } from '../manage-event-popup/manage-event-modal.component';
import { EventService } from '../../event.service';

import * as moment from 'moment';
import * as fromRoot from '../../../../core/core.reducer';

import { CurrentUserAppState } from '../../../../core/store/users/current-user/currentUser.reducer';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CCRulesFormComponent } from '../../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-event-manager',
  templateUrl: 'event-manager.component.html',
  styleUrls: ['event-manager.component.scss']
})
export class EventManagerComponent implements OnInit, OnDestroy {
  public events: any[] = [];
  public scheduleConfigHeader: any;
  @ViewChild(ManageEventModalComponent, {static: false}) private manageEventComponent: ManageEventModalComponent;
  public currentUser: any;
  public calendarExtraOptions = {
    views: {
      agenda: {
        timeFormat: 'HH:mm',
        slotLabelFormat: 'HH:mm'
      }
    }
  };

  private monthsArray = [];
  private currentMonth: any;
  private currentUserSub: any;
  private isFirstGetEvents = true;

  constructor(private eventService: EventService,
              private store$: Store<CurrentUserAppState>,
              private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.scheduleConfigHeader = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay, listMonth'
    };
    this.currentUserSub = this.store$.select(fromRoot.getCurrentUserState).subscribe((user: CurrentUserAppState) => {
      this.currentUser = user;
    });
  }

  getEvents(date, renew?, monthNum = 1) {
    if (this.monthsArray.indexOf(date) === -1 || renew) {
      this.eventService.getEvents(`${date}-01`, this.currentUser['id'], monthNum).subscribe(
        resp => {
          if (renew) {
            this.events = [];
            this.monthsArray = [];
          }

          if (resp.length) {
            this.monthsArray.push(date);
            if (monthNum === 3) {
              const prevMonth = moment(`${date}-01`).subtract(1, 'months').format('YYYY-MM'),
                nextMonth = moment(`${date}-01`).add(1, 'months').format('YYYY-MM');
              this.monthsArray.push(prevMonth, nextMonth);
            }

            resp.map(item => {
              this.events.push(this.formatEvent(item));
            });
          }
        },
        err => {
          this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        });
    }
  }

  formatEvent(event: any) {
    const obj = new Event();
    obj.title = event.title;
    obj.description = event.description;
    obj.start = moment(event.start).format();
    obj.end = moment(event.end).format();
    obj.allDay = event.allDay;
    obj.participants = event.taskEventParticipants;
    obj.createdBy = event.createdBy;
    obj.id = event.id;
    obj.notify = moment(event.notify).format();
    return obj;
  }

  handleDayClick(event) {
    this.manageEventComponent.createEvent(event.date, this.shouldShowTime(event));
  }

  handleEventClick(e) {
    this.manageEventComponent.viewEvent(e);
  }

  onViewRender(data) {
    if (data && data.view) {
      const currentMonth = this.getDate(data.view.start);

      this.currentMonth = data.view.start;
      if (this.isFirstGetEvents) {
        setTimeout(() => {
          this.getEvents(currentMonth.slice(0, -3), true, 3);
        });
        this.isFirstGetEvents = false;
      } else {
        this.getEvents(currentMonth.slice(0, -3));
      }
    }
  }

  private getDate(date) {
    return date.format('YYYY-MM-DD');
  }

  onEventChanged(data) {
    this.getEvents(data, true, 3);
  }


  shouldShowTime(event): boolean {
    return event.view && event.view.type === 'agendaWeek' ||
      event.view && event.view.type === 'agendaDay';
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }
}

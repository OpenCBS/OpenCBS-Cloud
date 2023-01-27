import {
  AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Event } from '../event.model';
import { FormLookupComponent } from '../../../../shared/modules/cbs-form/components/form-lookup/form-lookup.component';
import { environment } from '../../../../../environments/environment';
import { EventService } from '../../event.service';
import { Store } from '@ngrx/store';
import { CurrentUserAppState } from '../../../../core/store/users/current-user/currentUser.reducer';
import * as fromRoot from '../../../../core/core.reducer';

export enum FormMode {
  create,
  edit,
  view
}

const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '18:00';
const DEFAULT_NOTIFY_TIME = '08:00';

import * as moment from 'moment';

@Component({
  selector: 'cbs-manage-event-modal',
  templateUrl: 'manage-event-modal.component.html',
  styleUrls: ['manage-event-modal.component.scss']
})
export class ManageEventModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(FormLookupComponent, {static: false}) lookup: FormLookupComponent;
  @ViewChild('submitBtn', {static: false}) submitBtn: ElementRef;
  @Output() onSubmit = new EventEmitter();
  public isDialogVisible = false;
  public eventForm: FormGroup;
  public mode: FormMode = FormMode.create;
  private currentUser = null;
  public event: Event;
  public tempParticipants: any[] = [];
  public isResponseStatusOk = null;
  public formConfig = [
    {
      disabled: false,
      placeholder: 'EVENT_TITLE',
      name: 'title',
      caption: 'TITLE',
      fieldType: 'TEXT',
      required: true,
      value: ''
    },
    {
      disabled: false,
      placeholder: 'DESCRIPTION',
      name: 'description',
      caption: 'DESCRIPTION',
      fieldType: 'TEXT_AREA',
      required: true,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'allDay',
      caption: 'ALL_DAY_EVENT',
      fieldType: 'CHECKBOX',
      required: false,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'startDate',
      caption: 'START_DATE',
      fieldType: 'DATE',
      required: false,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'startTime',
      caption: 'TIME',
      fieldType: 'TIME',
      required: false,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'endDate',
      caption: 'END_DATE',
      fieldType: 'DATE',
      required: false,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'endTime',
      caption: 'TIME',
      fieldType: 'TIME',
      required: false,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'notifyDate',
      caption: 'NOTIFY_DATE',
      fieldType: 'DATE',
      required: false,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'notifyTime',
      caption: 'TIME',
      fieldType: 'TIME',
      required: false,
      value: ''
    },
    {
      disabled: false,
      placeholder: '',
      name: 'participants',
      caption: 'PARTICIPANTS',
      fieldType: 'LOOKUP',
      required: true,
      value: '',
      extra: {
        url: `${environment.API_ENDPOINT}task-events/participants`
      }
    }
  ];

  private currentUserSub: any;
  @Output() eventChanged = new EventEmitter();

  constructor(private store$: Store<CurrentUserAppState>,
              private eventService: EventService,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.eventForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      allDay: new FormControl(''),
      startDate: new FormControl('', [Validators.required]),
      startTime: new FormControl(''),
      endDate: new FormControl(''),
      endTime: new FormControl(''),
      notifyDate: new FormControl(''),
      notifyTime: new FormControl(''),
      participants: new FormControl('')
    });
    this.currentUserSub = this.store$.select(fromRoot.getCurrentUserState).subscribe((user: CurrentUserAppState) => {
      this.currentUser = user;
    });
  }

  ngAfterViewInit() {
    let allDayEventStatus = false;
    this.eventForm.valueChanges.subscribe(data => {
      if (data.allDay && !allDayEventStatus) {
        this.formConfig.map(field => {
          if (field.name === 'startTime' || field.name === 'endTime') {
            field.disabled = true;
            field.value = '00:00';
          }
        });
        allDayEventStatus = true;
      } else if (!data.allDay && allDayEventStatus) {
        this.formConfig.map(field => {
          if (field.name === 'startTime' || field.name === 'endTime') {
            field.disabled = false;
          }
        });
        allDayEventStatus = false;
      }
    });
  }

  cancel() {
    this.isDialogVisible = false;
    this.eventForm.reset();
  }

  public createEvent(date, showTime) {
    this.eventForm.reset();
    const eventDate = date.format('YYYY-MM-DD');
    let startTime, endTime, notifyTime;


    this.eventForm.controls['startDate'].setValue(eventDate);
    this.eventForm.controls['endDate'].setValue(eventDate);
    this.eventForm.controls['notifyDate'].setValue(eventDate);

    if (showTime) {
      startTime = date.format('HH:mm');
      endTime = moment(date).add(1, 'hours').format('HH:mm');
      notifyTime = moment(date).subtract(1, 'hours').format('HH:mm');
      this.eventForm.controls['startTime'].setValue(startTime);
      this.eventForm.controls['endTime'].setValue(endTime);
      this.eventForm.controls['notifyTime'].setValue(notifyTime);
    } else {
      startTime = DEFAULT_START_TIME;
      endTime = DEFAULT_END_TIME;
      notifyTime = DEFAULT_NOTIFY_TIME;
      this.eventForm.controls['startTime'].setValue(startTime);
      this.eventForm.controls['endTime'].setValue(endTime);
      this.eventForm.controls['notifyTime'].setValue(notifyTime);
    }

    this.applyDateAndTime(eventDate, startTime, eventDate, endTime, eventDate, notifyTime);

    this.tempParticipants = [];
    this.mode = FormMode.create;
    this.isDialogVisible = true;
  }

  applyDateAndTime(startDate, startTime, endDate, endTime, notifyDate, notifyTime) {
    this.formConfig.map(field => {
      if (field.name === 'startDate') {
        field.value = startDate;
      }
      if (field.name === 'endDate') {
        field.value = endDate;
      }
      if (field.name === 'notifyDate') {
        field.value = notifyDate;
      }
      if (field.name === 'startTime' && startTime) {
        field.value = startTime;
      }
      if (field.name === 'endTime' && endTime) {
        field.value = endTime;
      }
      if (field.name === 'notifyTime' && notifyTime) {
        field.value = notifyTime;
      }
    });
  }

  resetFormAndCreate() {
    this.isDialogVisible = true;
    this.mode = FormMode.create;
    this.eventForm.reset();
    this.tempParticipants = [];
    const newDate = new Date();
    const startNotifyEndDate = newDate.toISOString().slice(0, 10);
    this.eventForm.controls['startDate'].setValue(startNotifyEndDate);
    this.eventForm.controls['endDate'].setValue(startNotifyEndDate);
    this.eventForm.controls['notifyDate'].setValue(startNotifyEndDate);
    this.eventForm.controls['startTime'].setValue(DEFAULT_START_TIME);
    this.eventForm.controls['endTime'].setValue(DEFAULT_END_TIME);
    this.eventForm.controls['notifyTime'].setValue(DEFAULT_NOTIFY_TIME);
    this.applyDateAndTime(
      startNotifyEndDate, DEFAULT_START_TIME, startNotifyEndDate, DEFAULT_END_TIME, startNotifyEndDate, DEFAULT_NOTIFY_TIME);

    const currentUserObj = {
      id: this.currentUser.id,
      participantId: this.currentUser.id,
      name: this.currentUser.firstName + ' ' + this.currentUser.lastName,
      user: true,
      selected: true
    };
    this.addParticipant(currentUserObj, false);
  }

  viewEvent(e) {
    this.event = new Event();
    this.event.title = e.calEvent.title;
    this.event.description = e.calEvent.description;
    this.event.start = e.calEvent.start;
    this.event.end = e.calEvent.end ? e.calEvent.end : e.calEvent.start;
    this.event.notify = moment(e.calEvent.notify);
    this.event.allDay = e.calEvent.allDay;
    this.event.participants = e.calEvent.participants;
    this.event.createdBy = e.calEvent.createdBy;
    this.event.id = e.calEvent.id;

    this.showForm();
  }

  displayEvent(event: Event) {
    this.event = event;
    this.showForm();
  }

  private showForm() {
    this.eventForm.reset();
    if (this.currentUser['id'] === this.event.createdBy.id) {
      this.mode = FormMode.edit;
      this.displayInEditMode();
    } else {
      this.mode = FormMode.view;
    }

    this.isDialogVisible = true;
  }

  displayInEditMode() {
    this.eventForm.controls['title'].setValue(this.event.title);
    this.eventForm.controls['description'].setValue(this.event.description);
    this.eventForm.controls['allDay'].setValue(this.event.allDay);

    const startDate = this.getDate(this.event.start);
    const startTime = this.getTime(this.event.start);
    const endDate = this.getDate(this.event.end);
    const endTime = this.getTime(this.event.end);
    const notifyDate = this.getDate(this.event.notify);
    const notifyTime = this.getTime(this.event.notify);
    this.eventForm.controls['startDate'].setValue(startDate);
    this.eventForm.controls['startTime'].setValue(startTime);
    this.eventForm.controls['endDate'].setValue(endDate);
    this.eventForm.controls['endTime'].setValue(endTime);
    this.eventForm.controls['notifyDate'].setValue(notifyDate);
    this.eventForm.controls['notifyTime'].setValue(notifyTime);
    if (this.event.participants) {
      this.event.participants.forEach(participant => {
        this.addParticipant(participant, false);
      });
    }
    this.applyDateAndTime(startDate, startTime, endDate, endTime, notifyDate, notifyTime);
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitBtn.nativeElement, 'disabled', bool);
  }

  addParticipant(data, shouldClean?) {
    if (data && !this.tempParticipants.filter(item => item.name === data.name).length) {
      this.tempParticipants.push(data);
    }
    if (shouldClean) {
      this.lookup.clearLookupValue();
    }
    this.eventForm.controls['participants'].setValue(data.name);
  }

  removeParticipant(user) {
    this.tempParticipants.map((item, ind) => {
      if (item.id === user.id) {
        this.tempParticipants.splice(ind, 1);
      }
    });

    if (this.tempParticipants.length === 0) {
      this.lookup.clearLookupValue();
    }
  }

  submit({valid, value}) {
    if (!valid) {
      return;
    }
    this.disableSubmitBtn(true);
    const eventToSend = new Event();
    eventToSend.title = value.title;
    eventToSend.description = value.description;
    eventToSend.start = `${value.startDate}T${value.startTime ? value.startTime : '00:00'}:00`;
    eventToSend.end = `${value.endDate}T${value.endTime ? value.endTime : '00:00'}:00`;
    eventToSend.notify = `${value.notifyDate}T${value.notifyTime ? value.notifyTime : '00:00'}:00`;
    eventToSend.allDay = value.allDay || (value.startTime === '00:00' && value.endTime === '00:00');
    eventToSend.participants = [];
    this.tempParticipants.map(user => {
      eventToSend.participants.push({
        participantId: user.participantId,
        user: user.user,
      });
    });

    let command;
    if (this.mode === FormMode.create) {
      command = this.eventService.createEvent;
      eventToSend.id = null;
    } else {
      command = this.eventService.updateEvent;
      eventToSend.id = this.event.id;
      eventToSend.createdBy = this.currentUser['id']
    }
    command.call(this.eventService, eventToSend).subscribe(
      res => {
        if (res.title) {
          this.isResponseStatusOk = 'ok';
          this.onEventSuccessfullyProcessed(value.startDate);
          setTimeout(() => {
            this.isDialogVisible = false;
            this.isResponseStatusOk = 'null';
            this.onSubmit.emit();
            this.disableSubmitBtn(false);
          }, 1000);
        } else if (res.status === 'error') {
          this.isResponseStatusOk = 'error';
          setTimeout(() => {
            this.isResponseStatusOk = 'null';
            this.disableSubmitBtn(false);
          }, 1000);
        }
      },
      () => {
        this.isResponseStatusOk = 'error';
        setTimeout(() => {
          this.isResponseStatusOk = 'null';
        }, environment.RESPONSE_DELAY);
        this.disableSubmitBtn(false);
      }
    );
  }

  getDate(date) {
    return date.format('YYYY-MM-DD');
  }

  getTime(date) {
    return date.format('HH:mm');
  }

  onEventSuccessfullyProcessed(newDate) {
    const newDateRequest = newDate.slice(0, -3);

    if (this.mode === FormMode.edit) {
      const oldDateRequest = this.getDate(this.event.start).slice(0, -3);
      if (oldDateRequest !== newDateRequest) {
        this.eventChanged.emit(oldDateRequest);
        return;
      }
    }
    this.eventChanged.emit(newDateRequest);
  }

  public getEventHeader(): string {
    switch (this.mode) {
      case FormMode.edit:
        return 'UPDATE_EVENT';
      case FormMode.view:
        return this.event.title;
      default:
        return 'CREATE_NEW_EVENT';
    }
  }

  public canEditView(): boolean {
    return this.mode === FormMode.edit || this.mode === FormMode.create;
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }
}


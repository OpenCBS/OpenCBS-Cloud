import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import {
  HolidayListState,
  CreateHolidayState,
  UpdateHolidayState
} from '../../../../../core/store/holidays';
import { environment } from '../../../../../../environments/environment';
import { CustomFormModalComponent } from '../../../../../shared/components/cbs-custom-modal-form/custom-modal-form.component';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';


@Component({
  selector: 'cbs-config-holidays',
  templateUrl: 'holidays.component.html'
})
export class HolidaysListComponent implements OnInit, OnDestroy {
  @ViewChild(CustomFormModalComponent, {static: false}) private holidayFormModal: CustomFormModalComponent;

  public newHolidayFields = [
    {
      id: -1,
      caption: 'NAME',
      extra: null,
      fieldType: 'TEXT',
      name: 'name',
      order: 1,
      required: true,
      unique: false,
      value: ''
    },
    {
      id: 0,
      caption: 'DATE',
      extra: null,
      fieldType: 'DATE',
      name: 'date',
      order: 2,
      required: true,
      unique: false,
      value: ''
    },
    {
      id: 1,
      caption: 'HOLIDAY_ANNUAL',
      extra: null,
      fieldType: 'CHECKBOX',
      name: 'annual',
      order: 3,
      required: true,
      unique: false,
      value: ''
    }
  ];

  public isNew: boolean;
  public holidays: Observable<any>;
  public holidayCreateState: CreateHolidayState;
  public holidayUpdateState: UpdateHolidayState;
  public svgData = {
    collection: 'standard',
    class: 'reward',
    name: 'reward'
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'HOLIDAYS',
      link: '/configuration/holidays'
    }
  ];

  private createHolidaySub: any;
  private updateHolidaySub: any;
  private editedHolidayId: number;

  constructor(private holidayListStore$: Store<HolidayListState>,
              private holidayCreateStore$: Store<CreateHolidayState>,
              private holidayUpdateStore$: Store<UpdateHolidayState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
    this.holidays = this.store$.select(fromRoot.getHolidayListState);
  }

  ngOnInit() {
    this.createHolidaySub = this.store$.select(fromRoot.getHolidayCreateState)
    .subscribe((state: CreateHolidayState) => {

      if (state.loaded && state.success && !state.error) {
        this.closeModal();
        this.loadHolidays();
        this.resetState('create');
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('create');
        this.holidayFormModal.disableSubmitBtn(false);
      }

      this.holidayCreateState = state;
    });

    this.updateHolidaySub = this.holidayCreateStore$.select(fromRoot.getHolidayUpdateState)
    .subscribe((state: UpdateHolidayState) => {

      if (state.loaded && state.success && !state.error) {
        this.closeModal();
        this.loadHolidays();
        setTimeout(() => {
          this.resetState('update');
        }, 1400);
        this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
      } else if (state.loaded && !state.success && state.error) {
        this.closeModal();
        setTimeout(() => {
          this.resetState('update');
        }, 2000);
        this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
          this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState('update');
      }

      this.holidayUpdateState = state;
    });

    this.loadHolidays();
  }

  ngOnDestroy() {
    this.createHolidaySub.unsubscribe();
    this.updateHolidaySub.unsubscribe();
  }


  loadHolidays() {
    this.holidayListStore$.dispatch(new fromStore.LoadHolidays);
  }

  openCreateModal() {
    this.isNew = true;
    const newTranslatedFields = this.translateCaption(this.newHolidayFields);
    this.holidayFormModal.openModal(newTranslatedFields);
  }

  translateCaption(fields) {
    return fields.map(field => {
      const newFieldObj = Object.assign({}, field);
      this.translate.get(field.caption).subscribe((res: string) => {
        newFieldObj.caption = res;
      });
      return newFieldObj;
    });
  }

  openEditModal(details: { id, name, date, annual }) {
    this.editedHolidayId = details.id;
    this.isNew = false;
    const fields = [
      {
        id: 0,
        caption: 'NAME',
        extra: null,
        fieldType: 'TEXT',
        name: 'name',
        order: 1,
        required: true,
        unique: false,
        value: details.name
      },
      {
        id: 1,
        caption: 'DATE',
        extra: null,
        fieldType: 'DATE',
        name: 'date',
        order: 2,
        required: true,
        unique: false,
        value: details.date
      },
      {
        id: 2,
        caption: 'HOLIDAY_ANNUAL',
        extra: null,
        fieldType: 'CHECKBOX',
        name: 'annual',
        order: 2,
        required: true,
        unique: false,
        value: details.annual
      }
    ];
    const newTranslatedFields = this.translateCaption(fields);
    this.holidayFormModal.openModal(newTranslatedFields);
  }

  submitHoliday(data) {
    if (this.isNew) {
      this.saveNewHoliday(data);
    } else {
      this.saveEditHoliday(data);
    }
  }

  private saveNewHoliday(data) {
    const objectToSend = {
      name: data.fields[0]['value'],
      date: data.fields[1]['value'],
      annual: data.fields[2]['value']
    };
    this.holidayCreateStore$
    .dispatch(new fromStore.CreateHoliday(objectToSend));
  }

  private saveEditHoliday(data) {
    const objectToSend = {
      name: data.fields[0]['value'],
      date: data.fields[1]['value'],
      annual: data.fields[2]['value']
    };

    this.holidayUpdateStore$
    .dispatch(new fromStore.UpdateHoliday({obj: objectToSend, holidayId: this.editedHolidayId}));
    this.editedHolidayId = null;
  }

  private closeModal() {
    this.holidayFormModal.cancel();
  }

  private resetState(state?: string) {
    if (state === 'create') {
      this.holidayCreateStore$
      .dispatch(new fromStore.CreateHolidayReset());
    } else if (state === 'update') {
      this.holidayUpdateStore$
      .dispatch(new fromStore.UpdateHolidayReset);
    }
  }
}


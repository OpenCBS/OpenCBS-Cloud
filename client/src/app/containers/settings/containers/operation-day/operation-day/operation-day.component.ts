import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { OperationDayService } from '../shared/operation-day.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { CurrentUserService } from '../../../../../core/store/users/current-user';
import { AuthAppState } from '../../../../../core/store/auth';
import { environment } from '../../../../../../environments/environment';
import { DayClosureState } from '../../../../../core/store/message-broker/messages/day-closure';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import * as _ from 'lodash'

@Component({
  selector: 'cbs-operation-day',
  templateUrl: './operation-day.component.html',
  styleUrls: ['./operation-day.component.scss']
})
export class OperationDayComponent implements OnInit, OnDestroy {
  public date = '';
  public isOpen = false;
  public openWarning = false;
  public inProgress = false;
  public isLoading = false;
  public breadcrumbLinks = [
    {
      name: 'OPERATION_DAY',
      link: '/operation-day'
    }
  ];
  public svgData = {
    collection: 'standard',
    class: 'entity-milestone',
    name: 'entity_milestone'
  };

  public dayClosureDate = moment().format(environment.DATE_FORMAT_MOMENT);
  public processes: any[] = [];
  public hasPermission = false;
  public permissionSub: any;
  public leftDay: any;

  private processesSub: any;

  constructor(private operationService: OperationDayService,
              private toastrService: ToastrService,
              private currentUserService: CurrentUserService,
              private authStore$: Store<AuthAppState>,
              private router: Router,
              private dayClosureStore$: Store<DayClosureState>) {
  }

  ngOnInit() {
    this.dayClosureStore$.dispatch(new fromStore.LoadDayClosure());
    this.processesSub = this.dayClosureStore$.select(fromRoot.getDayClosureState).subscribe(dayClosureState => {
      if (dayClosureState.loaded && dayClosureState.dayClosure.processes) {
        this.processes = _.values(dayClosureState.dayClosure.processes);
        this.leftDay = dayClosureState.dayClosure.leftDays;
        if (this.leftDay > 0 ) {
          this.inProgress = true;
        }
      }
    });

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      userPermissions.forEach(module => {
        if (module['group'] === 'DAY_CLOSURE') {
          this.hasPermission = module['permissions'].includes('DAY_CLOSURE');
        }
      });
    });
  }

  dayClose(date) {
    if (date) {
      const chosenDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
      this.operationService.dayClosure(chosenDate)
      .pipe(catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, '', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully started', '', environment.SUCCESS_TOAST_CONFIG);
      });
    }
  }

  closeAndLogOut() {
    this.isOpen = false;
    this.openWarning = false;
    this.authStore$.dispatch(new fromStore.PurgeAuth());
    this.router.navigate(['/login']);
  }

  start() {
    this.isOpen = false;
    this.dayClose(moment().format(environment.DATE_FORMAT_MOMENT));
  }

  ngOnDestroy() {
    this.processesSub.unsubscribe()
  }
}


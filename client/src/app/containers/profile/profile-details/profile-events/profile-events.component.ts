import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IProfile } from '../../../../core/store/profile/model/profile.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';
import { getProfileStatus } from '../../../../core/store/profile/profile.selectors';
import * as ProfileUtils from '../../shared/profile.utils';
import { ProfileEventListState } from '../../../../core/store/profile-events/profile-events-list/profile-events-list.reducer';
import { ManageEventModalComponent } from '../../../event-manager/components/manage-event-popup/manage-event-modal.component';
import * as moment from 'moment';
import * as fromStore from '../../../../core/store';
import * as fromRoot from '../../../../core/core.reducer';
import {CCRulesFormComponent} from '../../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-profile-events',
  templateUrl: 'profile-events.component.html',
  styleUrls: ['./profile-events.component.scss']
})
export class ProfileEventsComponent implements OnInit, OnDestroy {
  @ViewChild(ManageEventModalComponent, {static: false}) manageEventModal: ManageEventModalComponent;
  public profile: any;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public opened = false;
  public currencies: any;
  public eventsList: any;
  public profileType: string;
  private permissionSub: any;
  private statusSub: any;
  private routeSub: any;
  private permissions: any[];

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private currentUserService: CurrentUserService,
              private eventStore$: Store<ProfileEventListState>) {
  }

  ngOnInit() {
    this.profile = this.profileStore$.select(fromRoot.getProfileState);
    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];
      if (this.profileType === 'people' || this.profileType === 'companies'  || this.profileType === 'groups') {
        this.url = `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/`;
      }
    });

    this.statusSub = this.profileStore$.select(fromRoot.getProfileState).pipe(
      (getProfileStatus()))
    .subscribe((status: string) => {
      if (this.profileType === 'people' || this.profileType === 'companies'  || this.profileType === 'groups') {
        this.navElements = ProfileUtils.setNavElements(
          this.profileType,
          this.profileId,
          this.permissions
        );
      }
    });
    this.eventStore$.dispatch(new fromStore.LoadProfileEventsList(this.profileId));
    this.eventsList = this.eventStore$.select(fromRoot.getProfileEventListState);
  }

  refreshProfileEventsList() {
    this.eventStore$.dispatch(new fromStore.LoadProfileEventsList(this.profileId));
  }

  openModal() {
    this.manageEventModal.resetFormAndCreate();
  }

  currentEvent(event) {
    const obj = {
      title: event.title,
      description: event.description,
      start: moment(event.start),
      end: moment(event.end),
      allDay: event.allDay,
      participants: event.taskEventParticipants,
      createdBy: event.createdBy,
      id: event.id,
      notify: moment(event.notify)
    };
    const currentEvent = {calEvent: obj};
    this.manageEventModal.viewEvent(currentEvent);
  }

  openAttachment(attachment) {
    if (attachment.contentType && this.testIfImage(attachment.contentType)) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  resetModal() {
    this.imageUrl = '';
  }

  ngOnDestroy() {
    this.permissionSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
  }
}

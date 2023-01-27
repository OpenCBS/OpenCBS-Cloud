import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import * as fromRoot from '../../../../core/core.reducer';
import {
  IProfile,
  getCurrentProfileFields,
  getProfileStatus
} from '../../../../core/store/index';
import * as ProfileUtils from '../../shared/profile.utils';
import { CustomFieldSectionValue } from '../../../../core/models/customField.model';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';

@Component({
  selector: 'cbs-profile-info',
  templateUrl: 'profile-info.component.html',
  styleUrls: ['profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  public profileData: any;
  public profileSections: CustomFieldSectionValue[];
  public sectionNavData: any = [];
  public activeSectionId = 1;
  public id;
  public url;
  public type: any;
  public navElements = [];
  public imageUrl = '';
  public opened = false;

  private fieldsSub: any;
  private routerSub: any;
  private statusSub: any;
  private permissionSub: any;
  private profileSub: any;
  private permissions: any[];
  private profile: any;

  constructor(private profileStore$: Store<IProfile>,
              private currentUserService: CurrentUserService,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute) {
    this.fieldsSub = this.store$.pipe(select(fromRoot.getProfileState), getCurrentProfileFields())
      .subscribe((sections: any[]) => {
        if ( sections.length ) {
          this.profileSections = sections;
          this.sectionNavData = [];

          sections.map(section => {
            this.sectionNavData.push({
              title: section.caption,
              id: section.id
            });
          });
        }
      });
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  ngOnInit() {
    this.profile = this.store$.pipe(select(fromRoot.getProfileState))
      .subscribe((profile: IProfile) => {
        this.profileData = profile;
      });

    this.permissionSub = this.currentUserService.currentUserPermissions$
      .subscribe(userPermissions => {
        this.permissions = userPermissions;
      });

    this.routerSub = this.route.parent.params.subscribe(params => {
      this.id = +params['id'];
      this.type = params['type'];

      if ( this.type === 'people' || this.type === 'companies' || this.type === 'groups' ) {
        this.url = `${environment.API_ENDPOINT}profiles/${this.type}/${this.id}/attachments/`;
      }
    });

    this.statusSub = this.store$.pipe(select(fromRoot.getProfileState), getProfileStatus())
      .subscribe((status: string) => {
        if ( this.type === 'people' || this.type === 'companies' || this.type === 'groups' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.type,
            this.id,
            this.permissions
          );
        }
      });
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  openAttachment(attachment) {
    if ( attachment.contentType && this.testIfImage(attachment.contentType) ) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.fieldsSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.profile.unsubscribe();
    this.permissionSub.unsubscribe();
    if ( this.profileSub ) {
      this.profileSub.unsubscribe();
    }
  }

  informVisibleBlock(sectionEl: HTMLElement) {
    const section = sectionEl.id;

    this.activeSectionId = +section.split('_')[1];
  }

  resetModal() {
    this.imageUrl = '';
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import * as fromRoot from '../../../../core/core.reducer';
import {
  getCurrentProfileFields,
  ProfileMakerCheckerService, IProfile
} from '../../../../core/store/index';
import { CustomFieldSectionValue } from '../../../../core/models/customField.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import * as fromStore from '../../../../core/store';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'cbs-profile-maker-checker',
  templateUrl: 'profile-maker-checker.component.html',
  styleUrls: ['profile-maker-checker.component.scss']
})

export class ProfileMakerCheckerComponent implements OnInit, OnDestroy {
  public profile: any;
  public profileSections: CustomFieldSectionValue[];
  public profileId: number;
  public navElements = [];
  public approveRequest = false;
  public rejectRequest = false;
  public profileType: string;

  private fieldsSub: any;
  private routeSub: any;
  private paramsSub: any;

  constructor(private profileMakerCheckerStateStore: Store<IProfile>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              public toastrService: ToastrService,
              public profileMakerCheckerService: ProfileMakerCheckerService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.profileId = params.id;
        this.profileMakerCheckerStateStore.dispatch(new fromStore.LoadProfileMakerChecker(this.profileId));
      }
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.profileType = query.type;
    });

    this.profile = this.store$.pipe(select(fromRoot.getProfileMakerCheckerState));
    this.fieldsSub = this.store$.pipe(select(fromRoot.getProfileMakerCheckerState))
      .pipe((getCurrentProfileFields())).subscribe((sections: any[]) => {
        if ( sections.length ) {
          this.profileSections = sections;
        }
      });
  }

  approveProfileRequest() {
    this.profileMakerCheckerService.approveMakerChecker(this.profileId)
      .pipe(catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully approved', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  rejectProfileRequest() {
    this.profileMakerCheckerService.rejectMakerChecker(this.profileId)
      .pipe(catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully reject', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  openApproveModal() {
    this.approveRequest = true;
  }

  openRejectModal() {
    this.rejectRequest = true;
  }

  closeModal() {
    this.approveRequest = false;
    this.rejectRequest = false;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}

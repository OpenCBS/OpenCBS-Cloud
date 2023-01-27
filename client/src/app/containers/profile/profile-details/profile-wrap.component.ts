import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { environment } from '../../../../environments/environment';
import { IProfile } from '../../../core/store/profile/model/profile.model';

@Component({
  selector: 'cbs-profle-wrap',
  template: '<router-outlet></router-outlet>'
})
export class ProfileWrapComponent implements OnInit, OnDestroy {
  private routeSub: any;
  private profileSub: any;

  constructor(private route: ActivatedRoute,
              private profileStore$: Store<IProfile>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private router: Router) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id, type }) => {
      if ( params && params.id && params.type ) {
        if ( this.profileSub ) {
          this.profileSub.unsubscribe();
        }
        this.profileSub = this.store$.pipe(select(fromRoot.getProfileState))
          .subscribe((state: IProfile) => {
            if ( !state.loaded && !state.loading && !state.error && !state.success ) {
              this.profileStore$.dispatch(new fromStore.LoadProfileInfo({id: +params.id, type: params.type}));
            } else if ( state.loaded && !state.loading && state.error && !state.success ) {
              this.toastrService.error(`ERROR: ${state.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
              setTimeout(() => {
                this.router.navigateByUrl('profiles');
              }, 200);
            }
          });
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.profileSub.unsubscribe();
    this.profileStore$.dispatch(new fromStore.ResetProfileInfo());
  }
}

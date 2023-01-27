import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';

import { ProfileFieldsState } from '../../../../../core/store/profile/profile-fields';
import { ProfileFieldsService } from '../../../../../core/store';

const SVG_DATA = {collection: 'standard', class: 'groups', name: 'groups'};

@Component({
  selector: 'cbs-profile-fields',
  templateUrl: 'profile-fields.component.html',
  styles: [`
    :host .slds-container--small {
      width: 100%;
    }
  `]
})
export class ProfileFieldsComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'CUSTOM_FIELDS',
      link: '/configuration/custom-field'
    },
    {
      name: 'PROFILE',
      link: ''
    }
  ];
  public profileFieldStore: Observable<ProfileFieldsState>;
  public type: string;
  public isLoading = false;
  public urls = {
    sectionUrl: '',
    fieldUrl: ''
  };
  public lookupTypes = [];
  public fieldTypes = environment.FIELD_TYPES;


  private routeSub: Subscription;

  constructor(private profileFieldsMetaStore$: Store<ProfileFieldsState>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private profileFieldsService: ProfileFieldsService,
              private translate: TranslateService) {
    this.profileFieldsService.getLookupType().subscribe(
      (res: any) => {
        if ( res.error ) {
          this.isLoading = false;
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.toastrService.clear();
          this.lookupTypes = res;
          this.isLoading = false;
          this.profileFieldStore = this.store$.pipe(select(fromRoot.getProfileFieldsState));
        }
      });
  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.params.subscribe(
      params => {
        this.type = params['type'];
        this.breadcrumbLinks[2] = {
          name: this.type.toUpperCase(),
          link: ''
        };
        if ( this.type === 'people' || this.type === 'companies' || this.type === 'groups' ) {
          this.profileFieldsMetaStore$.dispatch(new fromStore.LoadProfileFieldsMeta(this.type));
          this.urls.sectionUrl = `${environment.API_ENDPOINT}profiles/${this.type}/custom-field-sections`;
          this.urls.fieldUrl = `${environment.API_ENDPOINT}profiles/${this.type}/custom-fields`;
        }
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onUpdateSuccess(data) {
    this.translate.get('UPDATE_SUCCESS').subscribe(
      (res: string) => {
        this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
      });
    this.updateState(data);
  }

  onAddSuccess(data) {
    this.translate.get('CREATE_SUCCESS').subscribe(
      (res: string) => {
        this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
      });
    this.updateState(data);
  }

  onError(err) {
    this.toastrService.error(err.message, '', environment.ERROR_TOAST_CONFIG);
  }

  onDeleteSuccess(data) {
    this.translate.get('DELETE_SUCCESS').subscribe(
      (res: string) => {
        this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
      });
    this.updateState(data);
  }

  updateState(data) {
    this.profileFieldsMetaStore$.dispatch(new fromStore.LoadProfileFieldsMetaSuccess(data));
  }
}

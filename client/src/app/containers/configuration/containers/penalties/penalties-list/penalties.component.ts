import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

import { PenaltiesFormModalComponent } from '../shared/penalties-form-modal.component';

import { environment } from '../../../../../../environments/environment';
import {
  CreatePenaltyState,
  PenaltiesState,
  UpdatePenaltyState
} from '../../../../../core/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};


@Component({
  selector: 'cbs-penalties',
  templateUrl: 'penalties.component.html',
  styleUrls: ['penalties.component.scss']
})
export class PenaltiesComponent implements OnInit, OnDestroy {
  @ViewChild(PenaltiesFormModalComponent, {static: false}) private formModal: PenaltiesFormModalComponent;
  public svgData = SVG_DATA;
  public penalties: Observable<PenaltiesState>;
  public isNew = false;
  public queryObject = {
    page: 1
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'PENALTIES',
      link: '/configuration/penalties'
    }
  ];

  private editingPenaltyId: number;
  private currentPageSub: Subscription;
  private paramsSub: Subscription;
  private createPenaltySub: Subscription;
  private updatePenaltySub: Subscription;
  private fields = {
    name: '',
    beginPeriodDay: '',
    endPeriodDay: '',
    gracePeriod: '',
    penaltyType: '',
    penalty: '',
    accrualAccountId: '',
    incomeAccountId: '',
    writeOffAccountId: ''
  };

  constructor(private penaltiesStore$: Store<PenaltiesState>,
              private penaltyCreateStore$: Store<CreatePenaltyState>,
              private penaltyUpdateStore$: Store<UpdatePenaltyState>,
              private toastrService: ToastrService,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private translate: TranslateService) {
    this.penalties = this.store$.pipe(select(fromRoot.getPenaltiesState));
  }

  ngOnInit() {
    this.currentPageSub = this.penalties.pipe(this.getCurrentPage())
      .subscribe((page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {
          page: page + 1
        });
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? query['page'] : 1;
      this.queryObject.page !== 1 ? this.loadPenalties(this.queryObject) : this.loadPenalties();
    });

    this.createPenaltySub = this.store$.pipe(select(fromRoot.getPenaltyCreateState))
      .subscribe((state: CreatePenaltyState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.closeModal();
          this.loadPenalties();
          this.resetState('create');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState('create');
          this.formModal.disableSubmitBtn(false);
        }
      });

    this.updatePenaltySub = this.store$.pipe(select(fromRoot.getPenaltyUpdateState))
      .subscribe((state: UpdatePenaltyState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.closeModal();
          this.loadPenalties();
          this.resetState('update');
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState('update');
          this.formModal.disableSubmitBtn(false);
        }
      });
    this.loadPenalties();
  }

  getCurrentPage = () => {
    return state => state
      .map(s => {
        return s.currentPage;
      });
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/penalties'], navigationExtras);
  }

  ngOnDestroy() {
    this.createPenaltySub.unsubscribe();
    this.updatePenaltySub.unsubscribe();
    this.resetState('listUpdate');
  }

  loadPenalties(params ?: Object) {
    this.penaltiesStore$.dispatch(new fromStore.LoadPenalties(params));
  }

  openCreateModal() {
    this.isNew = true;
    this.formModal.openCreateModal(this.fields);
  }

  openEditModal(penalty) {
    this.editingPenaltyId = penalty.id;
    this.isNew = false;
    const newPenalty = Object.assign({}, penalty, {
      accrualAccountId: penalty.accrualAccount.id,
      incomeAccountId: penalty.incomeAccount.id,
      writeOffAccountId: penalty.writeOffAccount.id
    });
    delete newPenalty.id;
    delete newPenalty.accrualAccount;
    delete newPenalty.incomeAccount;
    delete newPenalty.writeOffAccount;
    this.formModal.openEditModal(newPenalty);
  }

  submitPenalty(data) {
    if ( this.isNew ) {
      this.saveNewPenalty(data);
    } else {
      this.saveEditPenalty(data);
    }
  }

  private saveNewPenalty(data) {
    this.penaltyCreateStore$
      .dispatch(new fromStore.CreatePenalty(data));
  }

  private saveEditPenalty(data) {
    this.penaltyUpdateStore$
      .dispatch(new fromStore.UpdatePenalty({data: data, penaltyId: this.editingPenaltyId}));
  }

  private closeModal() {
    this.formModal.cancel();
  }

  private resetState(state?: string) {
    if ( state === 'create' ) {
      this.penaltyCreateStore$
        .dispatch(new fromStore.CreatePenaltyReset());
    } else if ( state === 'update' ) {
      this.penaltyUpdateStore$
        .dispatch(new fromStore.UpdatePenaltyReset());
    } else if ( state === 'listUpdate' ) {
      this.penaltiesStore$
        .dispatch(new fromStore.PenaltiesReset());
    }
  }
}

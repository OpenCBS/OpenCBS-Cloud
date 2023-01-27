import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';

import { LoanAppSubmitService } from '../shared/services/loan-app-submit.service';
import {
  ILoanAppState,
  CurrentUserAppState,
  LoanAppCCActivityListActions,
  ILoanAppCCActivityList
} from '../../../core/store';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';

@Component({
  selector: 'cbs-credit-committee',
  templateUrl: 'loan-application-credit-committee.component.html',
  styleUrls: ['loan-application-credit-committee.component.scss']
})
export class CreditCommitteeComponent implements OnInit, OnDestroy {
  @ViewChild('notes', {static: false}) notesTextArea: ElementRef;
  public loanAppState: any;
  public loanAppId: number;
  public loanApplication: any;
  public isOpened = false;
  public directional = true;
  public isLoading = false;
  public currentCCMember: any;
  public breadcrumbLinks = [];
  public activityList: any;
  public opened = false;
  public text: string;
  public svgData = {
    collection: 'standard',
    class: 'approval',
    name: 'approval'
  };
  public data = [];
  public creditCommittee = [];
  public loanAppStatus: string;
  public currentUser: any;
  public submitService = this.loanAppSubmitService;
  public loanAppStatusEnum = LoanAppStatus;
  public readOnly = false;
  public progressValue: any;

  private ccMemberDecision: any;
  private loanApplicationSub: any;
  private currentUserSub: any;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private activityListActions: LoanAppCCActivityListActions,
              private activityListStore: Store<ILoanAppCCActivityList>,
              private loanAppSubmitService: LoanAppSubmitService,
              private store$: Store<fromRoot.State>,
              private router: Router) {
  }

  ngOnInit() {
    this.activityList = this.store$.select(fromRoot.getLoanAppCCActivityListState);
    this.currentUserSub = this.store$.select(fromRoot.getCurrentUserState)
    .subscribe((user: CurrentUserAppState) => {
      this.currentUser = user;
    });
    this.loanApplicationSub = this.store$.select(fromRoot.getLoanApplicationState).subscribe(
      (loanAppState: ILoanAppState) => {
        if (loanAppState.success && loanAppState.loaded && loanAppState.loanApplication) {
          this.loanAppState = loanAppState;
          this.loanApplication = loanAppState.loanApplication;
          this.readOnly = this.loanApplication.readOnly;
          this.loanAppId = this.loanApplication['id'];
          this.getCCActivityList(this.loanAppId);
          this.loanAppStatus = this.loanApplication['status'];
          switch (this.loanAppStatus) {
            case 'IN_PROGRESS':
              this.progressValue = 25 + '%';
              break;
            case 'PENDING':
              this.progressValue = 50 + '%';
              break;
            case 'APPROVED':
              this.progressValue = 75 + '%';
              break;
            default:
              this.progressValue = 100 + '%';
          }
          if (this.loanAppStatus === LoanAppStatus[LoanAppStatus.IN_PROGRESS]) {
            this.router.navigate(['/loan-applications', this.loanAppId]);
          }
          this.creditCommittee = this.loanApplication['creditCommitteeVotes'];
          const loanProfile = this.loanApplication['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: this.loanApplication['profile']['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: this.loanApplication['code'],
              link: ''
            },
            {
              name: 'CREDIT_COMMITTEE',
              link: ''
            }
          ];
          this.isLoading = false;
        }
      }
    );
  }

  isCurrentUserAbleToChangeStatus(ccMember) {
    if (this.loanAppStatus !== LoanAppStatus[LoanAppStatus.DISBURSED]) {
      return this.isCurrentUser(ccMember['role']['name']);
    } else {
      return false;
    }
  }

  private isCurrentUser(name: string): boolean {
    if (this.currentUser) {
      return name === this.currentUser['role'];
    }
  }


  getCCActivityList(loanAppId) {
    this.activityListStore
    .dispatch(this.activityListActions.fireInitialAction(loanAppId));
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
    this.currentUserSub.unsubscribe();
    this.activityListStore
    .dispatch(this.activityListActions.fireResetAction());
  }

  changeStatus(decision) {
    this.currentCCMember = decision.ccMember;
    if (this.isCurrentUserAbleToChangeStatus(decision.ccMember)) {
      if (decision.ccMember.status !== decision.status) {
        this.ccMemberDecision = {
          creditCommitteeVoteId: decision.ccMember.id,
          status: decision.status
        };
        this.openCCModal();
      }
    }
  }

  cancel() {
    this.isOpened = false;
  }

  saveDecision(notes) {
    const objToSend = Object.assign({}, this.ccMemberDecision, {
      notes: notes
    });
    this.loanApplicationStore$.dispatch(new fromStore.ChangeCCStatus({loanAppId: this.loanAppId, data: objToSend}));
    this.isOpened = false;
  }

  openCCModal() {
    this.notesTextArea.nativeElement.value = '';
    this.isOpened = true;
  }

  openModal(text) {
    this.opened = true;
    this.text = text;
  }

  closeModal() {
    this.opened = false;
  }

}

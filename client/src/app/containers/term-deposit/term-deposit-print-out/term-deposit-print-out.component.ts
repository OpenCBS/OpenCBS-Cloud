import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrintOutService } from '../../../core/services/print-out.service';
import * as FileSaver from 'file-saver';
import { environment } from '../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { select, Store } from '@ngrx/store';
import { ITermDepositState } from '../../../core/store';

@Component({
  selector: 'cbs-term-deposit-print-out',
  templateUrl: 'term-deposit-print-out.component.html',
  styleUrls: ['term-deposit-print-out.component.scss']
})

export class TermDepositPrintOutComponent implements OnInit, OnDestroy {
  public forms = [];
  public breadcrumb = [];
  public isLoading: boolean;
  public termDeposits: any;
  public termDepositLoaded: any;
  public termDepositStatus: string;

  private termDepositId: number;
  private termDepositSub: any;

  constructor(private printOutService: PrintOutService,
              private toastrService: ToastrService,
              private termDepositStore$: Store<ITermDepositState>) {
  }

  ngOnInit() {
  this.isLoading = true;
    this.printOutService.getForms('TERM_DEPOSIT').subscribe((forms) => {
      this.isLoading = false;
      if (!forms.err) {
        this.forms = forms;
      }
    });

    this.termDepositSub = this.termDepositStore$.pipe(select(fromRoot.getTermDepositState))
      .subscribe((termDepositState: ITermDepositState) => {
      if (termDepositState['loaded'] && !termDepositState['error'] && termDepositState['success']) {
        this.termDepositLoaded = termDepositState;
        this.termDeposits = termDepositState.termDeposit;
        this.termDepositId = termDepositState.termDeposit['id'];
        this.termDepositStatus = this.termDeposits.status;
        const profileType = this.termDeposits.profileType === 'PERSON' ? 'people' : 'companies';
        this.breadcrumb = [
          {
            name: this.termDeposits.profileName,
            link: `/profiles/${profileType}/${this.termDeposits.profileId}/info`
          },
          {
            name: 'TERM_DEPOSITS',
            link: `/profiles/${profileType}/${this.termDeposits.profileId}/term-deposits`
          },
          {
            name: 'PRINT OUT',
            link: ''
          }
        ];
      }
    });

    setTimeout(() => {
      this.termDepositStore$.dispatch(new fromStore.SetTermDepositBreadcrumb(this.breadcrumb));
    }, 1500);
  }

  downLoad(link) {
    const objToSend = {
      entityId: this.termDepositId,
      templateId: link['id']
    };
    this.printOutService.downloadForm(objToSend, 'TERM_DEPOSIT').subscribe(res => {
      if (res.err) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        FileSaver.saveAs(res, `${link['label']}.docx`);
      }
    })
  }

  ngOnDestroy() {
    this.termDepositSub.unsubscribe();
  }
}

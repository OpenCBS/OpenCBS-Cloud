import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrintOutService } from '../../../core/services';
import * as FileSaver from 'file-saver';
import { environment } from '../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { select, Store } from '@ngrx/store';
import { ISavingState } from '../../../core/store';

@Component({
  selector: 'cbs-saving-print-out',
  templateUrl: 'saving-print-out.component.html',
  styleUrls: ['saving-print-out.component.scss']
})

export class SavingPrintOutComponent implements OnInit, OnDestroy {
  public forms = [];
  public breadcrumb = [];
  public isLoading: boolean;
  public savings: any;
  public savingLoaded: any;

  private savingId: number;
  private savingStateSub: any;

  constructor(private printOutService: PrintOutService,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private savingStore$: Store<ISavingState>) {
  }

  ngOnInit() {
  this.isLoading = true;
    this.printOutService.getForms('SAVING').subscribe((forms) => {
      this.isLoading = false;
      if (!forms.err) {
        this.forms = forms;
      }
    });

    this.savingStateSub = this.store$.pipe(select(fromRoot.getSavingState)).subscribe(
      (savingState: ISavingState) => {
        if (savingState.loaded && savingState.success) {
          this.savings = savingState.saving;
          this.savingId = savingState.saving['id'];
          this.savingLoaded = savingState;
          const profileType = this.savings.profileType === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: this.savings.profileName,
              link: `/profiles/${profileType}/${this.savings.profileId}/info`
            },
            {
              name: 'SAVINGS',
              link: `/profiles/${profileType}/${this.savings.profileId}/savings`
            },
            {
              name: 'PRINT OUT',
              link: ''
            }
          ];

        }
      });

    setTimeout(() => {
      this.savingStore$.dispatch(new fromStore.SetSavingBreadcrumb(this.breadcrumb));
    }, 1500)
  }

  downLoad(link) {
    const objToSend = {
      entityId: this.savingId,
      templateId: link['id']
    };
    this.printOutService.downloadForm(objToSend, 'SAVING').subscribe(res => {
      if (res.err) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        FileSaver.saveAs(res, `${link['label']}.docx`);
      }
    })
  }

  ngOnDestroy() {
    this.savingStateSub.unsubscribe();
  }
}

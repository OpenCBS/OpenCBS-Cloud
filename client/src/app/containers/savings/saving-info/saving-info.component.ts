import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ActivatedRoute } from '@angular/router';
import { ISavingState } from '../../../core/store/saving/saving';

@Component({
  selector: 'cbs-saving-info',
  templateUrl: 'saving-info.component.html',
  styleUrls: ['saving-info.component.scss']
})
export class SavingInfoComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public savingId: number;
  public savings: any;
  public savingLoaded: any;

  private savingStateSub: any;

  constructor(private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private savingStore$: Store<ISavingState>) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.savingId = params.id;
      this.savingStore$.dispatch(new fromStore.LoadSaving(this.savingId));
    });

    this.savingStateSub = this.store$.select(fromRoot.getSavingState).subscribe(
      (savingState: ISavingState) => {
        if (savingState.loaded && savingState.success) {
          this.savings = savingState.saving;
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
              name: 'INFO',
              link: ''
            }
          ];

        }
      });

    setTimeout(() => {
      this.savingStore$.dispatch(new fromStore.SetSavingBreadcrumb(this.breadcrumb));
    }, 1500)
  }

  ngOnDestroy() {
    this.savingStateSub.unsubscribe();
  }
}

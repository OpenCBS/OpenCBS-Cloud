import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable ,  Subscription } from 'rxjs';
import { IBranchInfo, BranchInfoActions } from '../../../../../core/store/branches/branch-info';
import * as fromRoot from '../../../../../core/core.reducer';
import { map } from 'lodash';

const SVG_DATA = {collection: 'standard', class: 'hierarchy', name: 'hierarchy'};

@Component({
  selector: 'cbs-branch-info',
  templateUrl: 'branch-info.component.html',
  styleUrls: ['branch-info.component.scss']
})

export class BranchInfoComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public sectionNavData: any = [];
  public customFields = [];
  public svgData = SVG_DATA;
  public branchId: number;
  public info: Observable<IBranchInfo>;

  private routeSub: Subscription;
  private infoSub: Subscription;

  constructor(private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private branchInfoStore$: Store<IBranchInfo>,
              private branchInfoActions: BranchInfoActions) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.branchId = params['id'];
      this.loadBranchInfo(this.branchId);
    });

    this.info = this.store$.pipe(select(fromRoot.getBranchInfoState));
    this.infoSub = this.store$.pipe(select(fromRoot.getBranchInfoState))
      .subscribe((branchInfo: IBranchInfo) => {
        if ( branchInfo.loaded && branchInfo.success && !branchInfo.error ) {
          this.customFields = map(branchInfo.data.customFieldSections, (section: any) => {
            return {
              ...section,
              values: map(section.values, (field: any) => {
                return {
                  ...field.customField,
                  value: field.value
                }
              })
            }
          });
          branchInfo.data.customFieldSections.map(section => {
            this.sectionNavData.push({
              title: section.caption,
              id: section.id
            });
          });

          this.breadcrumbLinks = [
            {
              name: 'BRANCHES',
              link: '/configuration/branches'
            },
            {
              name: branchInfo['data']['name'],
              link: ''
            },
            {
              name: 'DETAILS',
              link: ''
            }
          ];
        }
      });
  }

  loadBranchInfo(id) {
    this.branchInfoStore$.dispatch(this.branchInfoActions.fireInitialAction(id));
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.infoSub.unsubscribe();
  }
}

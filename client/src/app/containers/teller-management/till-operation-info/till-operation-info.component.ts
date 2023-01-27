import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cbs-till-operation-info',
  templateUrl: 'till-operation-info.component.html'
})

export class TillOperationInfoComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public svgData = {
    collection: 'standard',
    class: 'groups',
    name: 'groups'
  };
  public operationId: number;
  public tillId: number;
  private routerSub: any;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.routerSub = this.route.params.subscribe(params => {
      this.operationId = params['id'];
      this.tillId = params['tillId'];
      this.breadcrumbLinks = [
        {
          name: 'TELLER_MANAGEMENT',
          link: '/till'
        },
        {
          name: this.tillId,
          link: '/till/' + this.tillId + '/operations'
        },
        {
          name: 'OPERATIONS',
          link: ''
        },
        {
          name: this.operationId,
          link: ''
        },
        {
          name: 'INFORMATION',
          link: ''
        }
      ]
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}

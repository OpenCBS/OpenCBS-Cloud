import {
  NgModule,
  Directive,
  ViewContainerRef,
  Input,
  ContentChildren,
  ContentChild,
  TemplateRef,
  OnInit,
  AfterContentInit,
  QueryList, OnDestroy, EmbeddedViewRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/* tslint:disable */
@Component({
  selector: 'cbs-tree-table-header',
  template: '<ng-content></ng-content>'
})
export class HeaderComponent {
}

@Component({
  selector: 'cbs-tree-table-footer',
  template: '<ng-content></ng-content>'
})
export class FooterComponent {
}

@Directive({
  selector: '[cbsTemplate]'
})
export class CbsTemplateDirective {

  @Input() cbsTemplateName: string;

  constructor(public template: TemplateRef<any>) {
  }

  getType(): string {
    return this.cbsTemplateName;
  }
}

@Component({
  selector: 'cbs-column',
  template: ``
})
export class ColumnComponent implements AfterContentInit {
  @Input() field: string;
  @Input() header: string;
  @Input() footer: string;
  @Input() sortable: any;
  @Input() rowspan: number;
  @Input() colspan: number;
  @Input() style: any;
  @Input() styleClass: string;
  @Input() hidden: boolean;
  @Input() width: string;
  @ContentChildren(CbsTemplateDirective) templates: QueryList<any>;
  @ContentChild(TemplateRef, {static: false}) template: TemplateRef<any>;

  public headerTemplate: TemplateRef<any>;
  public bodyTemplate: TemplateRef<any>;
  public footerTemplate: TemplateRef<any>;

  ngAfterContentInit(): void {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'header':
          this.headerTemplate = item.template;
          break;

        case 'body':
          this.bodyTemplate = item.template;
          break;

        case 'footer':
          this.footerTemplate = item.template;
          break;

        default:
          this.bodyTemplate = item.template;
          break;
      }
    });
  }
}

@Component({
  selector: 'cbs-columnBodyTemplateLoader',
  template: ``
})
export class ColumnBodyTemplateLoaderComponent implements OnInit {

  @Input() column: any;

  @Input() rowData: any;

  @Input() rowIndex: number;

  constructor(public viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.column.bodyTemplate, {
      '\$implicit': this.column,
      'rowData': this.rowData,
      'rowIndex': this.rowIndex
    });
  }
}

@Component({
  selector: 'cbs-columnHeaderTemplateLoader',
  template: ``
})
export class ColumnHeaderTemplateLoaderComponent implements OnInit {

  @Input() column: any;

  constructor(public viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.column.headerTemplate, {
      '\$implicit': this.column
    });
  }
}

@Component({
  selector: 'cbs-template-loader',
  template: ``
})
export class TemplateLoaderComponent implements OnInit, OnDestroy {

  @Input() template: TemplateRef<any>;

  @Input() data: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.template) {
      this.view = this.viewContainer.createEmbeddedView(this.template, {
        '\$implicit': this.data
      });
    }
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
    ;
  }
}


@NgModule({
  imports: [CommonModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    ColumnComponent,
    ColumnHeaderTemplateLoaderComponent,
    ColumnBodyTemplateLoaderComponent,
    CbsTemplateDirective,
    TemplateLoaderComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    ColumnComponent,
    ColumnHeaderTemplateLoaderComponent,
    ColumnBodyTemplateLoaderComponent,
    CbsTemplateDirective,
    TemplateLoaderComponent
  ]
})
export class SharedTreetableModule {
}

/* tslint:enable */

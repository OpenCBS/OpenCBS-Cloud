import {
  NgModule,
  Directive,
  ElementRef,
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  ContentChildren,
  QueryList,
  Inject,
  forwardRef, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent, FooterComponent, ColumnComponent, CbsTemplateDirective} from './shared-treetable';
import { SharedTreetableModule } from './shared-treetable';


export interface TreeNode {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
}


/* tslint:disable */
@Component({
  selector: '[cbs-tree-row]',
  template: `
    <tr class="slds-hint-parent"
        [attr.aria-level]="level"
        [attr.aria-expanded]="node.expanded">
      <td
        *ngFor="let col of treeTable.columns; let i=index"
        [ngStyle]="col.style"
        [ngClass]="{'slds-tree__item': i === 0}"
        [class]="col.styleClass"
        [attr.width]="col.width"
        cbsHighlight>
        <button
          class="slds-button slds-button--icon slds-button--icon-x-small slds-m-right--x-small cbs-treetable__toggler"
          *ngIf="i === 0"
          [ngClass]="{ 'slds-is-disabled': isLeaf() }"
          [title]="node.expanded ? labelCollapse : labelExpand"
          aria-controls="expand-btn"
          (click)="toggle($event)">
          <svg class="slds-button__icon slds-button__icon--small cbs-treetable__toggler__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="slds-assistive-text">Toggle</span>
        </button>

        <div class="slds-truncate" *ngIf="!col.template" title="{{ resolveFieldData(node.data, col.field) }}">
          <a href="javascript:void(0);"
             *ngIf="node.children"
             (click)="node.children && node.children.length > 0 ? toggle($event) : null">
            {{ resolveFieldData(node.data, col.field) }}
          </a>
        </div>
        <cbs-columnBodyTemplateLoader [column]="col" [rowData]="node"
                                      *ngIf="col.template"></cbs-columnBodyTemplateLoader>
      </td>
    </tr>
    <tr *ngIf="node.children && node.expanded" class="slds-hint-parent" [attr.aria-level]="level">
      <td [attr.colspan]="treeTable.columns.length" style="padding: 0; border-top: none;">
        <table>
          <tbody
            cbs-tree-row
            *ngFor="let childNode of node.children"
            [node]="childNode"
            [level]="level + 1"
            [labelExpand]="labelExpand"
            [labelCollapse]="labelCollapse"></tbody>
        </table>
      </td>
    </tr>
  `
})
export class TreeRowComponent {

  @Input() node: TreeNode;

  @Input() level = 1;

  @Input() labelExpand = 'Expand';

  @Input() labelCollapse = 'Collapse';

  constructor(@Inject(forwardRef(() => TreeTableComponent)) public treeTable: TreeTableComponent) {
  }

  toggle(event: Event) {
    if (this.node.expanded) {
      this.treeTable.onNodeCollapse.emit({originalEvent: event, node: this.node});
    } else {
      this.treeTable.onNodeExpand.emit({originalEvent: event, node: this.node});
    }

    this.node = Object.assign({}, this.node, {
      expanded: !this.node.expanded
    });

    event.preventDefault();
  }

  isLeaf() {
    return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
  }

  resolveFieldData(data: any, field: string): any {
    if (data && field) {
      if (field.indexOf('.') === -1) {
        return data[field];
      } else {
        let fields: string[] = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }
}

@Component({
  selector: 'cbs-tree-table',
  template: `
    <table class="slds-table slds-table--bordered slds-tree slds-table--tree slds-no-row-hover" role="treegrid"
           aria-readonly="true">
      <thead>
      <tr class="slds-text-title--caps">
        <th #headerCell *ngFor="let col of columns; let i = index;" [ngStyle]="col.style" [class]="col.styleClass">
                        <span class="slds-truncate"
                              [ngClass]="{'slds-p-left--medium': i === 0}"
                              *ngIf="!col.headerTemplate">{{col.header}}</span>
          <span *ngIf="col.headerTemplate">
                            <cbs-columnHeaderTemplateLoader [column]="col"></cbs-columnHeaderTemplateLoader>
                        </span>
        </th>
      </tr>
      </thead>

      <tbody
        cbs-tree-row
        *ngFor="let node of value"
        [node]="node"
        [level]="1"
        [labelExpand]="labelExpand"
        [labelCollapse]="labelCollapse"></tbody>

    </table>
  `,
  styleUrls: ['treetable.component.scss']
})
export class TreeTableComponent {

  @Input() value: TreeNode[];

  @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();

  @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();

  @Input() style: any;

  @Input() styleClass: string;

  @Input() labelExpand = 'Expand';

  @Input() labelCollapse = 'Collapse';

  @ContentChild(HeaderComponent, {static: false}) header: HeaderComponent;

  @ContentChild(FooterComponent, {static: false}) footer: FooterComponent;

  @ContentChildren(ColumnComponent) columns: QueryList<ColumnComponent>;
}

@Directive({
  selector: '[cbsHighlight]'
})
export class HighlightDirective {
  private _defaultColor = '#f4f6f9';
  private el: HTMLElement;


  @Input('highlightColor') highlightColor: string;

  private highlight(color: string) {
    this.el.parentElement.style.backgroundColor = color;
  }

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this._defaultColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

}

@NgModule({
  imports: [CommonModule, SharedTreetableModule],
  exports: [TreeTableComponent, SharedTreetableModule],
  declarations: [TreeTableComponent, TreeRowComponent, HighlightDirective]
})
export class CbsTreeTableModule {
}

/* tslint:enable */

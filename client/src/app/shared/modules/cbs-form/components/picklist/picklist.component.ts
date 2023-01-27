import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';

interface LookupResponse {
  content: any[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: any;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'cbs-picklist',
  templateUrl: 'picklist.component.html',
  styleUrls: ['picklist.component.scss']
})
export class PicklistComponent implements OnInit, OnChanges {
  @Input() config: { url, scope, defaultQuery };
  @Input() value: number;
  @Input() filterType: string;
  @Input() code: boolean;
  @Input() hasAll: boolean;
  @Input() searchPlaceholder = 'Search';
  @Input() selectPlaceholder = 'Select';
  @Input() selectValue = 'name';
  @Input() disabled = false;
  @Input() excludedItems = [];
  @Input() defaultValue: any;
  @Output() onSelect = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() onPicklistOpen = new EventEmitter();
  @Output() onPicklistClose = new EventEmitter();
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;
  @ViewChild('scrollBlock', {static: false}) scrollBlock: ElementRef;
  @ViewChild('trigger', {static: false}) trigger: ElementRef;

  public noData = false;
  public isOpened = false;
  public lookupList: any[] = [];
  public searchQuery = '';
  public valueString: string;
  public selectedCode: string;
  public loading = true;

  public triggerRect: any;
  public scrollStrategy: ScrollStrategy;

  public currentValue;
  private currentPage;
  private searchQueryChanged: Subject<string> = new Subject<string>();

  private picklistData: LookupResponse;

  constructor(private httpClient: HttpClient,
              private readonly sso: ScrollStrategyOptions) {
    this.scrollStrategy = this.sso.block();
  }

  ngOnInit() {
    if ( this.defaultValue ) {
      this.currentValue = this.defaultValue;
      this.valueString = this.defaultValue;
    }
    if ( this.config && this.config.url ) {
      if ( this.config.defaultQuery ) {
        this.getData(this.config.url, 0, this.config.defaultQuery);
      } else if (this.config['defaultValue']) {
        this.getData(this.config.url, 0, this.config['defaultValue']['name']);
      } else {
        this.getData(this.config.url);
      }
    }

    this.searchQueryChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(searchString => {
        this.searchQuery = searchString;
        this.lookupList = [];
        this.getData(this.config.url, 0, searchString);
      });
  }

  ngOnChanges(changes: { excludedItems: SimpleChange, value: SimpleChange, config: SimpleChange }) {
    if ( changes['excludedItems'] && changes['excludedItems'].currentValue ) {
      this.currentValue = changes['excludedItems'].currentValue;
      this.removeExcludedItems(this.lookupList, changes['excludedItems'].currentValue);
    }
    // Set value only when there is a change in value input
    if ( changes.value && changes.value.currentValue ) {
      this.assignSelected(changes.value.currentValue);
    }
    // Look for changes in defaultQuery and make request if it differs
    if ( changes.config && changes.config.currentValue && changes.config.previousValue
      && changes.config.currentValue.defaultQuery !== changes.config.previousValue.defaultQuery ) {
      this.getData(changes.config.currentValue.url, 0, changes.config.currentValue.defaultQuery)
    }
  }

  getData(url: string, page = 0, searchString?: string) {
    this.loading = true;
    let lookupUrl;
    if ( searchString ) {
      lookupUrl = `${url}${this.hasQuery(url) ? '&' : '?'}search=${searchString}&page=${page}`;
    } else {
      lookupUrl = `${url}${this.hasQuery(url) ? '&' : '?'}page=${page}`;
    }
    this.getLookupData(lookupUrl).subscribe(
      (resp: LookupResponse) => {
        this.loading = false;
        if ( this.config.scope ) {
          resp = resp[this.config.scope];
        }
        if ( resp && resp.content ) {
          this.picklistData = Object.assign({}, resp);
          this.currentPage = resp.number;
          if ( this.hasAll ) {
            this.lookupList.unshift({name: 'All'});
            this.selectPlaceholder = 'All';
          }
          this.lookupList = [...this.lookupList, ...resp.content];
          if ( this.currentValue && this.lookupList ) {
            this.removeExcludedItems(this.lookupList, this.currentValue);
          }
          if (!this.value && resp.content[0] && resp.content.length === 1 ) {
            this.select(resp.content[0])
          }
          if ( this.value && this.value > 0 ) {
            this.assignSelected(this.value);
          } else {
            this.assignSelected();
          }
        } else {
          this.noData = true;
        }
      },
      err => {
        console.warn('Error getting lookup data: ', err.error.message);
        this.noData = true;
      }
    );
  }

  hasQuery(url: string): boolean {
    return url.indexOf('?') > 0;
  }

  assignSelected(value?) {
    this.lookupList.map(item => {
      if ( item.id === value ) {
        item['selected'] = true;
        this.valueString = item[this.filterType];
        if ( this.code ) {
          this.selectedCode = item['number'];
        }
      } else {
        item['selected'] = false;
      }
    });
    if ( !value || value === -1 ) {
      this.valueString = '';
    }
  }

  getLookupData(url): Observable<any> {
    return this.httpClient.get(`${url}`);
  }

  remove() {
    this.selectPlaceholder = 'Select';
    this.value = -1;
    this.valueString = '';
    this.lookupList.map(item => {
      item.selected = false;
    });
    this.onSelect.emit();
    this.clear();
  }

  removeWithoutEmit() {
    this.value = -1;
    this.valueString = '';
    this.lookupList.map(item => {
      item.selected = false;
    });
    this.clear();
  }

  clear() {
    this.searchQuery = '';
    this.lookupList = [];

    this.getData(this.config.url, 0);
    this.onClear.emit();
  }

  select(item) {
    this.assignSelected(item.id);
    this.value = item.id;
    this.valueString = item[this.filterType];
    this.onSelect.emit(item);
    this.isOpened = false;
    this.onPicklistClose.emit();
    this.valueString = item[this.filterType];
  }

  search(searchString) {
    this.searchQueryChanged.next(searchString);
  }

  onScroll() {
    const page = this.currentPage + 1;
    if ( page < this.picklistData.totalPages ) {
      if ( this.searchQuery ) {
        this.getData(this.config.url, page, this.searchQuery);
      } else {
        this.getData(this.config.url, page);
      }
    }
  }

  removeExcludedItems(lookupList, excludedItemIds) {
    excludedItemIds.map(id => {
      lookupList.map(item => {
        if ( +id === item['id'] ) {
          lookupList.splice(lookupList.indexOf(item), 1);
        }
      });
    });
  }

  open() {
    if ( this.disabled || this.isOpened ) {
      return;
    }
    this.isOpened = true;
    // Focus search input
    setTimeout(() => {
      if ( this.searchInput && this.searchInput.nativeElement ) {
        this.searchInput.nativeElement.focus();
        this.scrollBlock.nativeElement.scrollTop = 0;
      }
    });

    this.onPicklistOpen.emit();

    this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
  }

  close() {
    this.isOpened = false;
    this.onPicklistClose.emit();
  }
}

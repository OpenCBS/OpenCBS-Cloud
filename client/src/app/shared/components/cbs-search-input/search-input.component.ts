import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
/**
 * Created by Chyngyz on 1/23/2017.
 */
import {Component, OnInit, Input, Output, EventEmitter, Renderer2} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'cbs-search-input',
  templateUrl: 'search-input.component.html'
})
export class SearchInputComponent implements OnInit {
  @Input() searchQuery = '';
  @Input() placeholder = '';
  @Input() autoFocus = true;
  @Output() onSearch = new EventEmitter();
  @Output() onClear = new EventEmitter();

  private searchQueryChanged: Subject<string> = new Subject<string>();

  constructor(private renderer2: Renderer2) {
    this.searchQueryChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(model => {
        this.searchQuery = model;
        this.search(model);
      });
  }

  ngOnInit() {
    const element = this.renderer2.selectRootElement('#cbs-search');
    element.focus();
  }

  changed(searchQuery: string) {
    this.searchQueryChanged.next(searchQuery);
  }

  clear() {
    this.searchQuery = '';
    this.onClear.emit();
  }

  search(searchQuery: string) {
    this.onSearch.emit(searchQuery);
  }
}

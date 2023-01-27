import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cbs-icon-nav',
  templateUrl: 'icon-nav.component.html',
  styleUrls: ['icon-nav.component.scss']
})
export class IconVerticalNavComponent implements OnInit {
  @Input() navConfig: Object;
  @Input() size = 'small';
  @Input() type = 'vertical';
  @Input() align = 'start';
  @Input() hasBgHover = true;
  @Input() hrefStyle: string;
  @Input() iconStyle: string;
  public nextRoute: string;

  constructor(private router: Router) {
  }

  navigate(url) {
    this.nextRoute = url;
    this.router.navigateByUrl(url);
  }

  ngOnInit() {
  }
}

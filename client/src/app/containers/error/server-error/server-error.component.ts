import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cbs-server-error',
  templateUrl: 'server-error.component.html'
})
export class ServerErrorComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  goHome() {
    this.router.navigateByUrl('/');
  }
}

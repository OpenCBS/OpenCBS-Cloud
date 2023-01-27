import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}


@Injectable()
export class OnEditCanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(component, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
                nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return component.canDeactivate ? component.canDeactivate(nextState.url) : true;
  }
}


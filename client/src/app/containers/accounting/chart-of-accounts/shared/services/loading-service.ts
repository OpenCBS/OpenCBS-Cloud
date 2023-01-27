import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
  public statusSource = new BehaviorSubject<any>(false);


  showLoader(bool) {
    this.statusSource.next(bool);
  }
}

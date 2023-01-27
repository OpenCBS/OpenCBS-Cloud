import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from './http-client-headers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpHeaderInterceptorService implements HttpInterceptor {
  constructor(private httpClientHeaderService: HttpClientHeadersService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedReq = request.clone({headers: this.httpClientHeaderService.getHeaders()});
    return next.handle(clonedReq);
  }
}

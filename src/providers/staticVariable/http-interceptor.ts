import { Injectable } from '@angular/core';
import { HttpErrorResponse,HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class AngularInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).timeout(20000).do(event => {
    }, err => { 
      if(err instanceof HttpErrorResponse){
          console.log("Error Caught By Interceptor");
          //console.log(JSON.stringify(err))
          Observable.throw(err);
      }
  });
  }
}
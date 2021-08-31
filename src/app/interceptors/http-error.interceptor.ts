import {

  HttpEvent,

  HttpInterceptor,

  HttpHandler,

  HttpRequest,

  HttpResponse,

  HttpErrorResponse

} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)

      .pipe(

        retry(1),

        catchError((error: HttpErrorResponse) => {

          let errorMessage = '';
          console.log("err", error);
          if (error.error instanceof ErrorEvent) {

            // client-side error

            errorMessage = `Error: ${ error.error.message }`;

          } else {

            // server-side error

            errorMessage = `Error Code: ${ error.status } \nMessage: ${ error.message }`;

          }

          //window.alert(errorMessage);
          const g = window.document.getElementById('globalError');
          if (g) {
            g.innerHTML = errorMessage;
            g.setAttribute("style", "display: block; position: absolute; left: 20%;");
          }

          return throwError(errorMessage);

        })

      )

  }

}

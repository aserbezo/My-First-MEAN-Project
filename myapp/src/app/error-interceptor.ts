import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponet } from "./error/error.componet";

@Injectable()
export class ErrorIntercepter implements HttpInterceptor {
constructor (private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>,next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
      //console.log(error)
      let errorMessage = 'An unknown error occurred!!'
      if (error.error.message){
        errorMessage = error.error.message
      }
      this.dialog.open(ErrorComponet, {data: {errorMessage}})
      //alert(error.message)
      return throwError(error)
      })
    );
  }
}

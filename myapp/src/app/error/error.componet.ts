import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: './error.componet.html'
})
export class ErrorComponet {
  //message = 'An unknown error occured!'
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {

  }
}

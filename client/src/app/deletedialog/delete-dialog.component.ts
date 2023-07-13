import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  template: `
<button mat-button mat-dialog-close id="deleteCancel" class="row my-primary-text" style="margin-left:80%;font-size: x-large">X</button>
<h2  class=" my-primary-text" mat-dialog-title>{{modalTitle}}</h2>
<mat-dialog-content class=" my-primary-text">Do you wish to delete this {{entityname}}?</mat-dialog-content>
<mat-dialog-actions class=" my-primary-text">
<button mat-button mat-dialog-close id="deleteNo">No</button>
<!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
<button mat-button [mat-dialog-close]="true" id="deleteYes">Yes</button>
</mat-dialog-actions>
`
})
export class DeleteDialogComponent {
  modalTitle: string;
  entityname: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.modalTitle = data.title;
    this.entityname = data.entityname;
  }
}

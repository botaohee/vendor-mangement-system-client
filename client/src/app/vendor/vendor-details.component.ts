import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Vendor } from './vendor';

import { ValidatePhone } from '../validators/phoneno.validator';
import { ValidateEmail } from '../validators/email.validator';
import { ValidatePostalCode } from '../validators/postalcode.validator';
import { DeleteDialogComponent } from '../deletedialog/delete-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';



@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  // styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  // @Input where we will keep track of the vendor instance that the user has selected
  @Input() selectedVendor: Vendor;
  @Input() todo: string;
  // @Outpu annotations are used in conjuction with EventEmitters
  // To signal to its parent that the data has either been changed or the user changed their mind
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  vendorForm: FormGroup;
  name: FormControl;
  city: FormControl;
  province: FormControl;
  postalcode: FormControl;
  phone: FormControl;
  type: FormControl;
  email: FormControl;
  address1: FormControl;

  hideCharError: boolean;

  // a group of intrinsic controls that represent the form fields in logic
  constructor(private builder: FormBuilder, private dialog: MatDialog) {
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.city = new FormControl('', Validators.compose([Validators.required]));
    this.province = new FormControl('', Validators.compose([Validators.required]));
    this.postalcode = new FormControl('', Validators.compose([Validators.required, ValidatePostalCode]));
    this.type =  new FormControl('', Validators.compose([Validators.required]));
    this.phone = new FormControl('', Validators.compose([Validators.required, ValidatePhone]));
    this.email = new FormControl('', Validators.compose([Validators.required, ValidateEmail]));
    this.address1 = new FormControl('', Validators.compose([Validators.required]));
  } // constructor

  // ngOnInit lifecycle method then loads the form with the data using
  // patchValue method
  phoneChange: any;
  ngOnInit(): void {
    this.vendorForm = new FormGroup({
      name: this.name,
      city: this.city,
      province: this.province,
      postalcode: this.postalcode,
      phone: this.phone,
      type: this.type,
      email : this.email,
      address1: this.address1,
    });
    // you can use setvalue method too
    // Difference: patchValue is more forgiving and does not need to have all the data present where setValue does
    // patchValue doesn’t care if all values present
    this.vendorForm.patchValue({
      name: this.selectedVendor.name,
      city: this.selectedVendor.city,
      province: this.selectedVendor.province,
      postalcode: this.selectedVendor.postalcode,
      phone: this.selectedVendor.phone,
      type: this.selectedVendor.type,
      email: this.selectedVendor.email,
      address1: this.selectedVendor.address1,

    });
  }

  updateSelectedVendor(): void {
    this.selectedVendor.name = this.vendorForm.value.name;
    this.selectedVendor.city = this.vendorForm.value.city;
    this.selectedVendor.province = this.vendorForm.value.province;
    this.selectedVendor.postalcode = this.vendorForm.value.postalcode;
    this.selectedVendor.phone = this.vendorForm.value.phone;
    this.selectedVendor.type = this.vendorForm.value.type;
    this.selectedVendor.email = this.vendorForm.value.email;
    this.selectedVendor.address1 = this.vendorForm.value.address1;
    // The instance is subsequently passed back to the parent by emitting the saved event
    this.saved.emit(this.selectedVendor);
  }
  autoTransferPhoneNumber(searchValue: any, backspace: boolean): void{
    if (this.todo === 'New Vendor')
    {
      if (searchValue !== undefined)
      {
        if (this.isNumric(searchValue) )
        {
          let newVal = searchValue.replace(/\D/g, '');
          if (backspace && newVal.length <= 6) {
            newVal = newVal.substring(0, newVal.length - 1);
          }
          if (newVal.length === 0) {
            newVal = '';
          } else if (newVal.length <= 3) {
            newVal = newVal.replace(/^(\d{0,3})/, '($1)');
          } else if (newVal.length <= 6) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1)$2');
          } else if (newVal.length <= 10) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1)$2-$3');
          } else {
            newVal = newVal.substring(0, 10);
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1)$2-$3');
          }
          this.phoneChange = newVal;
          this.hideCharError = false;
        }
        else {
          this.hideCharError = true;
        }
      }


    }
    else
    {
      this.phoneChange = this.selectedVendor.phone;
    }


  }

   isNumric(str: string): boolean {
    let code = 0;
    let i = 0;
    let len = 0;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (/*!(code > 47 && code < 58) && // numeric (0-9)*/
        (code > 64 && code < 91) || // upper alpha (A-Z)
        (code > 96 && code < 123) ||
        (code === 28 )  ||
        (code === 29)
      ) { // ()
        return false;
      }
    }
    return true;
  }

  openDeleteModal(selectedVendor: Vendor): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      title: `Delete Vendor ${this.selectedVendor.id}`,
      entityname: 'vendor'
    };
    dialogConfig.panelClass = 'custommodal';
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleted.emit(this.selectedVendor);
      }
    });
  } // openDeleteModal
}

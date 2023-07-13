import { Component, OnInit } from '@angular/core';
import { Vendor } from './vendor';
import { VendorService } from './vendor.service';
import { Observable, of } from 'rxjs';
import { catchError, share, map } from 'rxjs/operators';

@Component({
  selector: 'app-casestudy',
  templateUrl: 'vendor-home.component.html'
})
export class VendorHomeComponent implements OnInit {
  vendors$: Observable<Vendor[]>;
  vendor: Vendor;
  msg: string;
  hideEditForm: boolean;
  todo: string;


  constructor(public vendorService: VendorService) {
    this.hideEditForm = true;
  } // constructor

  ngOnInit(): void {
    this.msg = `Vendor's loaded`;
    this.vendors$ = this.vendorService.getAll().pipe(
      share(),
      catchError( error => {
        if (error.error instanceof  ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        }
        else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
  } // ngOnInit

  select(vendor: Vendor): void {
    this.todo = 'update';
    this.vendor = vendor;
    this.msg = `${vendor.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select

  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    if (msg) {
      this.msg = 'Operation cancelled';
    }
    this.hideEditForm = !this.hideEditForm;
  } // cancel


  /**
   * update - send changed update to service update local array
   */
  update(vendor: Vendor): void {
    this.vendorService.update(vendor).subscribe( payload => {
        if (payload.id > 0) {
          this.msg = `Vendor ${vendor.id} updated!`;
        } else {
          this.msg = 'Vendor not updated! - server error';
        }
        this.hideEditForm = !this.hideEditForm;
      },
      err => {
        this.msg = `Error - vendor not updated - ${err.status} - ${err.statusText}`;
      });
  } // update

  /**
   * save - determine whether we're doing and add or an update
   */
  save(vendor: Vendor): void {
    (vendor.id) ? this.update(vendor) : this.add(vendor);
  } // save
  /**
   * add - send vendor to service, receive new employee back
   */
  add(vendor: Vendor): void {
    vendor.id = 0;
    this.vendorService.add(vendor).subscribe( payload => {
        if (payload.id > 0) {
          this.msg = `Vendor ${payload.id} added!`;
        } else {
          this.msg = 'Vendor not added! - server error';
        }
        this.hideEditForm = !this.hideEditForm;
      },
      err => {
        this.msg = `Error - vendor not added - ${err.status} - ${err.statusText}`;
      });
  } // add
  /**
   * delete - send vendor id to service for deletion
   */
  delete(vendor: Vendor): void {
    this.vendorService.delete(vendor.id)
      .subscribe(payload => {
          if (payload === 1) { // server returns # rows deleted
            this.msg = `Vendor ${vendor.id} deleted!`;
          } else {
            this.msg = 'Vendor not deleted!';
          }
          this.hideEditForm = !this.hideEditForm;
        },
        err => {
          this.msg = `Error - Vendor not deleted - ${err.status} - ${err.statusText}`;
        });
  } // delete
  /**
   * newVendor - create new employee instance
   */
  newVendor(): void {
    this.vendor = {id: null, name: '', address1: '', city: '', province: '', postalcode: '', phone: '', type: '', email: ''};
    this.msg = 'New Vendor';
    this.hideEditForm = !this.hideEditForm;
  } // newEmployee
} // VendorHomeComponent

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Product } from './product';
import { Vendor } from '../vendor/vendor';
import { VendorService } from '../vendor/vendor.service';
import { ProductService } from '../product/product.service';
import { Observable, of } from 'rxjs';
import { catchError, share } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styles: [
  ]
})
export class ProductHomeComponent implements OnInit {
  vendors$: Observable<Vendor[]>;
  products: Product[];
  products$: Observable<Product[]>;
  selectedProduct: Product;
  hideEditForm: boolean;
  msg: string;
  todo: string;
  url: string;
  displayedColumns: string[] = ['id', 'name', 'vendorid'];
  dataSource: MatTableDataSource<Product>;

  size: number;

  /*
  Notice we have @ViewChild annotation on a property called sort. @ViewChild
  is used to access an element, component or what angular calls a directive.
  In our case we need to access a directive called MatSort that allows the table
  to have sortable columns. A directive is a special function in Angular that lets
  you do custom things with the html.
  */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private vendorService: VendorService, private productService: ProductService) {
    this.hideEditForm = true;
  } // constructor

  ngOnInit(): void {
    this.msg = 'loading vendor from server...';
    this.msg = `Vendor's loaded`;
    this.vendors$ = this.vendorService.getAll().pipe(
      share(),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
    // vendor
    this.msg = `Product's loaded`;
    this.products$ = this.productService.getAll().pipe(
      share(),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
    // product
    this.refreshDS();
  }// ngOnInit

  select(product: Product): void {
    this.todo = 'update';
    this.selectedProduct = product;
    this.msg = `Product ${product.name} selected`;
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
    this.selectedProduct = null;
    this.refreshDS();
  } // cancel

  /**
   * update - send changed update to service update local array
   */
  update(product: Product): void {
    this.msg = 'Updating...';
    this.productService.update(product).subscribe( payload => {
        if (payload.id !== '') {
          this.msg = `Product ${product.id} updated!`;
        } else {
          this.msg = 'Product not updated! - server error';
        }
        this.refreshDS();
      },
      err => {
        this.msg = `Error - Product not updated - ${err.status} - ${err.statusText}`;
      });
    this.hideEditForm = !this.hideEditForm;
  } // update
  /**
   * add - send expense to service, receive newid back
   */
  add(product: Product): void {
    this.msg = 'Adding...';
    this.productService.add(product).subscribe( payload => {
        if (payload.id !== '') {
          this.msg = `Product ${payload.id} added!`;
        } else {
          this.msg = 'Product not added! - server error';
        }
        this.refreshDS();
      },
      err => {
        this.msg = `Error - Product not added - ${err.status} - ${err.statusText}`;
      });
    this.hideEditForm = !this.hideEditForm;
  } // add
  /**
   * save - determine whether we're doing and add or an update
   */
  save(product: Product): void {
    (this.msg === 'New product') ?   this.add(product) : this.update(product);
    this.selectedProduct = null;
    this.refreshDS();
  } // save
  /**
   * newExpense - create new expense instance
   */
  newProduct(): void {
    this.selectedProduct = { id: null, vendorid: null, name: '',
      costprice: null, msrp: null, rop: null, eoq: null, qoh: null , qoo: null , qrcode: null, qrcodetxt: null};
    this.msg = 'New product';
    this.hideEditForm = !this.hideEditForm;
  } // newProduct
  /**
   * delete - send expense id to service for deletion
   */
  delete(product: Product): void {
    this.msg = 'Deleting...';
    this.productService.delete(product.id)
      .subscribe(payload => {
          if (payload === 1) { // server returns # rows deleted
            this.msg = `Product ${product.id} deleted!`;
          } else {
            this.msg = 'Product not deleted!';
          }
          this.refreshDS();
        },
        err => {
          this.msg = `Error - product not deleted - ${err.status} - ${err.statusText}`;
        });
    this.hideEditForm = !this.hideEditForm;
    this.selectedProduct = null;
  } // delete

  refreshDS(): void {
    this.products$ = this.productService.getAll().pipe(
      share(),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );


    this.products$.subscribe(products => {
      this.size = products.length;
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });
  } // refresh


}

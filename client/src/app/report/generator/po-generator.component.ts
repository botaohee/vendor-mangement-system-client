import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { Observable, of, Subscription} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vendor } from '../../vendor/vendor';
import { Product } from '../../product/product';
import { ReportItem } from '../report-item';
import { Report } from '../report';
import { BASEURL, PDFURL } from '../../constants';
import { VendorService } from '../../vendor/vendor.service';
import { ProductService } from '../../product/product.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-po-generator',
  templateUrl: './po-generator.component.html',
  styles: [
  ]
})
export class PoGeneratorComponent implements OnInit, OnDestroy {

  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  qtyid: FormControl;
  subscription: Subscription;
  products$: Observable<Product[]>; // everybody's products
  vendors$: Observable<Vendor[]>; // all vendors
  vendorproducts$: Observable<Product[]>; // all products for a particular vendor
  items: Array<ReportItem>; // product items that will be in report
  selectedproducts: Product[]; // product that being displayed currently in app
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  selectedQty: string; // the current selected vendor
  pickedProduct: boolean;
  pickedVendor: boolean;
  pickedEOQ: boolean;

  generated: boolean;
  hasProduct: boolean;
  msg: string;
  total: number;
  url: string;
  qtySelections: any [];

  datecreated: Date;
  reportno: number;

  constructor(private builder: FormBuilder,
              private vendorService: VendorService,
              private productService: ProductService,
              private reportService: ReportService) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.generated = false;
    this.url = BASEURL + 'pos';
  }

  ngOnInit(): void {
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.qtyid = new FormControl('');
    this.generated = false;
    this.hasProduct = false;
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.pickedEOQ = false;
    this.generatorForm = this.builder.group({
      vendorid: this.vendorid,
      productid: this.productid,
      qtyid: this.qtyid
    });
    this.qtySelections = [];
    this.qtySelections.push('EOQ');
    for (let i = 0; i <= 50; i++) {
      const obj = new Object(i);
      this.qtySelections.push(obj);
    }

    this.onPickVendor();
    this.onPickProduct();
    this.onPickEOQ();
    this.msg = 'loading vendors and products from server...';
    this.vendors$ = this.vendorService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]); // returns an empty array if there's a problem
      })
    );
    this.products$ = this.productService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
    this.msg = 'Data loaded';
  } // ngOnInit
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  } // ngOnDestroy


  viewPdf(): void {
    window.open(PDFURL + this.reportno, '');
  } // viewPdf


  onPickVendor(): void {
    this.subscription = this.generatorForm.get('vendorid').valueChanges.subscribe(val => {
      this.qtyid.setValue(' ');
      this.selectedProduct = null;
      this.selectedVendor = val;
      this.loadVendorProducts();
      this.pickedProduct = false;
      this.pickedEOQ = false;
      this.hasProduct = false;
      this.msg = 'choose product for vendor';
      this.pickedVendor = true;
      /*this.generated = false;*/
      this.selectedproducts = []; // array for the details in app html
      this.items = []; // array for the report
    });
  } // onPickVendor


  onPickProduct(): void {
    const xSubscr = this.generatorForm.get('productid').valueChanges.subscribe(val => {
      if ( this.selectedProduct !== null)
      {
        if ( this.selectedProduct.name !== val)
        {
          this.qtyid.setValue(' ');
          this.selectedProduct = val;

        }
        else {
          this.selectedProduct = val;
          this.pickedProduct = true;
          this.msg = 'choose qty for product';
          this.generated = false;
        }
      }
      else
      {
        this.selectedProduct = val;
        this.pickedProduct = true;
        this.msg = 'choose qty for product';
        this.generated = false;
      }



    });
    this.subscription.add(xSubscr);
  } // onPickProduct

  onPickEOQ(): void {
    const xSubscr = this.generatorForm.get('qtyid').valueChanges.subscribe(val => {

      if ( val.toString() === '0')
      {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].productid === this.selectedProduct.id)
          {
           this.items.splice(i,  1);
          }
        }
        for (let i = 0; i < this.selectedproducts.length; i++) {
          if (this.selectedproducts[i].id === this.selectedProduct.id)
          {
            this.selectedproducts.splice(i, 1);
          }
        }
        if ( this.selectedproducts.length === 0)
        {
          this.hasProduct = false;
          this.total = 0.0;
          this.msg = 'No Items';
        }
        else {
          this.msg = 'All ' + this.selectedProduct.name + ' Removed';
          this.total = 0.0;
          this.selectedproducts.forEach(pro => this.total += pro.eoq * pro.costprice);
        }
      }
      else if (val !== ' '){

      if (val === this.selectedProduct.eoq  || val === 'EOQ')
      {
        const item: ReportItem = {id: 0, reportid: 0, productid: this.selectedProduct.id, price: this.selectedProduct.costprice, qty: this.selectedProduct.eoq};
        const product: Product = {
          id: this.selectedProduct.id,
          vendorid: this.selectedProduct.vendorid,
          name: this.selectedProduct.name,
          costprice: this.selectedProduct.costprice,
          msrp: this.selectedProduct.msrp,
          rop: this.selectedProduct.rop,
          eoq: this.selectedProduct.eoq,
          qoh: this.selectedProduct.qoh,
          qoo: this.selectedProduct.eoq,
          qrcode: null,
          qrcodetxt: null,
        };

        if (this.items.find(it => it.productid === this.selectedProduct.id)) { // ignore entry
          for (let i = 0 ; i < this.selectedproducts.length ; i++)
          {
            if (this.selectedproducts[i].id === product.id)
            {
              this.items[i]  =  item;
              this.selectedproducts[i] = product;
            }
          }
        } else { // add entry
          this.items.push(item);
          this.selectedproducts.push(product);
        }
        if (this.items.length > 0) {
          this.hasProduct = true;
        }
        this.total = 0.0;
        this.selectedproducts.forEach(pro => this.total += pro.eoq * pro.costprice);
        this.msg = this.selectedProduct.eoq + ' ' + this.selectedProduct.name + '(s) Added';
      }
      else {
        if ( val.toString() !== ' ')
        {
          const item: ReportItem = {id: 0, reportid: 0, productid: this.selectedProduct.id, price: this.selectedProduct.costprice, qty: val};
          const product: Product = {
            id: this.selectedProduct.id,
            vendorid: this.selectedProduct.vendorid,
            name: this.selectedProduct.name,
            costprice: this.selectedProduct.costprice,
            msrp: this.selectedProduct.msrp,
            rop: this.selectedProduct.rop,
            eoq: this.selectedProduct.eoq,
            qoh: this.selectedProduct.qoh,
            qoo: val,
            qrcode: null,
            qrcodetxt: null,
          };
          if (this.items.find(it => it.productid === this.selectedProduct.id)) { // ignore entry
            for (let i = 0 ; i < this.selectedproducts.length ; i++)
            {
              if (this.selectedproducts[i].id === product.id)
              {
                this.items[i]  =  item;
                this.selectedproducts[i] = product;
              }
            }
          } else { // add entry
            this.items.push(item);
            this.selectedproducts.push(product);
          }
          if (this.items.length > 0) {
            this.hasProduct = true;
          }
          this.total = 0.0;
          this.selectedproducts.forEach(pro => this.total += pro.eoq * pro.costprice);
          this.msg = val + ' '  + this.selectedProduct.name + '(s) Added';
        }


      }
    }


    });
    this.subscription.add(xSubscr); // add it as a child, so all can be destroyed together
  }

  loadVendorProducts(): void {
    this.vendorproducts$ = this.products$.pipe(
      map( products =>
        // map each product in the array and check whether or not it belongs to selected vendor
        products.filter(product => product.vendorid === this.selectedVendor.id)
      )
    );
  } // loadVendorProducts


  createReport(): void {

    const report: Report = {id: 0, items: this.items, vendorid: this.selectedVendor.id, amount: this.total * 1.13, podate: null};
    const rSubscr = this.reportService.add(report).subscribe(
      payload => { // server should be returning new id
        if (typeof payload === 'number') {
          this.selectedproducts.forEach( selectpro => {this.update(selectpro) ; });
          this.msg = `PO ${payload} added!`;
          this.reportno = payload;
          this.generated = true;
          /*this.generated = true;*/
        } else {
          this.msg = 'PO not added! - server error';
          this.ngOnInit();
        }
        this.hasProduct = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.pickedEOQ = false;

      },
      err => {
        this.msg = `Error - PO not added - ${err.status} - ${err.statusText}`;
        this.ngOnInit();
        this.msg = 'PO not added! - server error';
      });

    this.subscription.add(rSubscr); // add it as a child, so all can be destroyed together
  } // createReport


  update(product: Product): void {
    // this.msg = 'Updating...';
    const rSubscr = this.productService.update(product).subscribe( payload => {
        if (payload.id !== '') {
          // this.msg = `Product ${product.id} updated!`;
        } else {
          this.msg = 'Product not updated! - server error';
        }
        // this.refreshDS();
      },
      err => {
        this.msg = `Error - Product not updated - ${err.status} - ${err.statusText}`;
      });
    // this.hideEditForm = !this.hideEditForm;
    this.subscription.add(rSubscr);
  } // update
}

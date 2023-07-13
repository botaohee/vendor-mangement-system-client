import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { Observable, of, Subscription} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vendor } from '../../vendor/vendor';
import { Product } from '../../product/product';
import { ReportItem } from '../report-item';
import { Report } from '../report';
import { PDFURL, VIEWPDFURL } from '../../constants';
import { VendorService } from '../../vendor/vendor.service';
import { ProductService } from '../../product/product.service';
import { ReportService } from '../report.service';

@Component({
  templateUrl: './po-viewer.component.html',
})
export class PoViewerComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  reportid: FormControl;
  subscription: Subscription;
  reports$: Observable<Report[]>; // everybody's expenses
  vendors$: Observable<Vendor[]>; // all employees
  vendorpos$: Observable<Report[]>; // all expenses for a particular employee
  selectedVendor: Vendor; // the current selected employee
  selectedReport: Report; // the current selected expense
  pickedReport: boolean;
  pickedVendor: boolean;
  viewed: boolean;
  hasItems: boolean;
  products$: Observable<Product[]>;
  selectedproducts: Product[];
  msg: string;
  total: number;
  // reports: Array<Report>;
  poCount: number;
  selectedIndex: number;
  reportno: number;
  reportHidden: boolean;
  constructor(private builder: FormBuilder,
              private vendorService: VendorService,
              private productService: ProductService,
              private reportService: ReportService) {
    this.pickedVendor = false;
    this.pickedReport = false;
    this.viewed = false;
  }

  ngOnInit(): void {
    this.msg = '';
    this.poCount = 0;
    this.reportHidden = false;
    this.vendorid = new FormControl('');
    this.reportid = new FormControl('');
    this.generatorForm = this.builder.group({
      reportid: this.reportid,
      vendorid: this.vendorid
    });
    this.onPickVendor();
    this.onPickReport();
    this.msg = 'loading employees and expenses from server...';
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
    this.msg = 'server data loaded';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  } // ngOnDestroy
  viewPdf(): void {
    this.reportno = this.selectedReport.id;
    window.open(PDFURL + this.reportno, '');
    this.msg = 'detail for PO ' + this.selectedIndex;
  } // viewPdf
  onPickVendor(): void {
    this.subscription = this.generatorForm.get('vendorid').valueChanges.subscribe(val => {
      this.selectedReport = null;
      this.selectedVendor = val;
      this.loadVendorReports();
      this.showPoCountMessage();
      this.pickedReport = false;
      this.hasItems = false;
      this.pickedVendor = true;
      this.viewed = false;
      this.selectedproducts = []; // array for the details in app html
    });
  } // onPickVendor

  loadVendorReports(): void {
    this.vendorpos$ = this.reportService.getById(this.selectedVendor.id).pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );


  } // loadVendorReports
  onPickReport(): void {
    const xSubscr = this.generatorForm.get('reportid').valueChanges.subscribe(val => {

      this.selectedproducts = [];
      this.total = 0;
      this.selectedReport = val;
      this.selectedIndex = val.id;
      this.selectedReport.items.map(item => {
        this.products$
          .pipe(map(products => products
            .find(product => product.id === item.productid)))
          .subscribe(pro => {
            this.selectedproducts.push(pro);
            this.total += pro.costprice * pro.qoo;
          });
        this.pickedReport = true;
        this.hasItems = true;
      });
      this.msg = 'Po: ' + this.selectedIndex;
    });
    this.subscription.add(xSubscr); // add it as a child, so all can be destroyed together
  } // onPickReport
  showPoCountMessage(): void{
    // retrieve observable length
    const xSubscr = this.vendorpos$.subscribe(result => {
      if (result.length !== 0)
      {
        this.poCount = result.length;
        this.msg = this.poCount + ' - POs loaded! for ' + this.selectedVendor.name;
      }
      else {
        this.msg = 'There is no report for '  + this.selectedVendor.name;
        this.pickedVendor = false;
      }
    });
    this.subscription.add(xSubscr);
  }// showPoCountMessage

}

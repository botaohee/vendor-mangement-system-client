import {FormControl, FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from './product';
import { Vendor } from '../vendor/vendor';
import {ValidateDecimal} from '../validators/decimal.validator';
import {ValidateInteger} from '../validators/integer.validator';
import { DeleteDialogComponent } from '../deletedialog/delete-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styles: [
  ]
})
export class ProductDetailComponent implements OnInit {
  // setter
  @Input() selectedProduct: Product;
  @Input() vendors: Vendor[];
  @Input() products: Product[];
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  productForm: FormGroup;

  id: FormControl;
  vendorid: FormControl;
  name: FormControl;
  costprice: FormControl;
  msrp: FormControl;
  rop: FormControl;
  eoq: FormControl;
  qoh: FormControl;
  qoo: FormControl;
  qrcodetxt: FormControl;
  constructor(private builder: FormBuilder, private dialog: MatDialog) {
    this.id = new FormControl('', Validators.compose([this.uniqueCodeValidator.bind(this), Validators.required]));
    this.vendorid = new FormControl('', Validators.compose([Validators.required, ValidateInteger]));
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.costprice = new FormControl('', Validators.compose([Validators.required, ValidateDecimal]));
    this.msrp = new FormControl('', Validators.compose([Validators.required, ValidateDecimal]));
    this.rop = new FormControl('', Validators.compose([Validators.required, ValidateInteger]));
    this.eoq = new FormControl('', Validators.compose([Validators.required, ValidateInteger]));
    this.qoh = new FormControl('', Validators.compose([Validators.required, ValidateInteger]));
    this.qoo = new FormControl('', Validators.compose([Validators.required, ValidateInteger]));
    this.qrcodetxt = new FormControl('', Validators.compose([Validators.required]));
  } // constructor

  ngOnInit(): void {
    this.productForm = this.builder.group({
      id: this.id,
      vendorid: this.vendorid,
      name: this.name,
      costprice: this.costprice,
      msrp: this.msrp,
      rop: this.rop,
      eoq: this.eoq,
      qoh: this.qoh,
      qoo: this.qoo,
      qrcodetxt: this.qrcodetxt,
    });
  // patchValue doesn't care if all values are present
    this.productForm.patchValue({
      id: this.selectedProduct.id,
      vendorid: this.selectedProduct.vendorid,
      name: this.selectedProduct.name,
      costprice: this.selectedProduct.costprice,
      msrp: this.selectedProduct.msrp,
      rop: this.selectedProduct.rop,
      eoq: this.selectedProduct.eoq,
      qoh: this.selectedProduct.qoh,
      qoo: this.selectedProduct.qoo,
      qrcodetxt: this.selectedProduct.qrcodetxt
    });
  } // ngOnInit

  updateSelectedProduct(): void {
    this.selectedProduct.id = this.productForm.get('id').value;
    this.selectedProduct.vendorid = this.productForm.get('vendorid').value;
    this.selectedProduct.name = this.productForm.get('name').value;
    this.selectedProduct.costprice = this.productForm.get('costprice').value;
    this.selectedProduct.msrp = this.productForm.get('msrp').value;
    this.selectedProduct.rop = this.productForm.get('rop').value;
    this.selectedProduct.eoq = this.productForm.get('eoq').value;
    this.selectedProduct.qoh = this.productForm.get('qoh').value;
    this.selectedProduct.qoo = this.productForm.get('qoo').value;
    this.selectedProduct.qrcodetxt = this.productForm.get('qrcodetxt').value;
    this.saved.emit(this.selectedProduct);
  }
  uniqueCodeValidator(control: AbstractControl): { idExists: boolean }  {
    /**
     * uniqueCodeValidator - needed access to products property so not
     * with the rest of the validators
     */
    if (this.products) {
      return this.products.find(p => p.id === control.value && !this.selectedProduct.id) ? {idExists: true} : null;
    } // uniqueCodeValidator
  }

  openDeleteModal(selectedProduct: Product): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      title: `Delete Product ${this.selectedProduct.id}`,
      entityname: 'product'
    };
    dialogConfig.panelClass = 'custommodal';
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleted.emit(this.selectedProduct);
      }
    });
  } // openDeleteModal

}

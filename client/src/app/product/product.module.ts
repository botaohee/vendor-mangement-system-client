import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatComponentsModule} from '../mat-components/mat-components.module';
import { ProductHomeComponent } from './product-home.component';
import { ProductDetailComponent } from './product-detail.component';
import { DeleteDialogComponent } from '../deletedialog/delete-dialog.component';


@NgModule({
  declarations: [ProductHomeComponent, ProductDetailComponent],
  entryComponents: [DeleteDialogComponent],
  imports: [
    CommonModule,
    MatComponentsModule,
  ]
})
export class ProductModule { }

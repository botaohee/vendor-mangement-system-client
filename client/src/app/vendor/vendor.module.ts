import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorListComponent } from './vendor-list.component';
import { VendorHomeComponent } from './vendor-home.component';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { VendorDetailsComponent } from './vendor-details.component';
import { DeleteDialogComponent } from '../deletedialog/delete-dialog.component';


@NgModule({
  declarations: [VendorListComponent, VendorHomeComponent, VendorDetailsComponent],
  entryComponents: [DeleteDialogComponent],
  imports: [
    CommonModule,
    MatComponentsModule,
  ]
})
export class VendorModule { }

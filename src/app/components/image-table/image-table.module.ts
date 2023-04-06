import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageTableComponent } from './image-table.component';
import { FilterService } from 'src/app/services/filter.service';
import { ImageEntryComponent } from '../image-entry/image-entry.component';

@NgModule({
  declarations: [ImageEntryComponent, ImageTableComponent],
  imports: [CommonModule],
  exports: [ImageEntryComponent, ImageTableComponent],
  providers: [FilterService],
})
export class ImageTableModule {}

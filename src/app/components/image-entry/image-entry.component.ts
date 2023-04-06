import { Component, Input } from '@angular/core';
import { Image } from '../../model/model';

@Component({
  selector: 'app-image-entry',
  templateUrl: './image-entry.component.html',
  styleUrls: ['./image-entry.component.scss'],
})
export class ImageEntryComponent {
  @Input() public image: Image | null = null;
}

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Image } from '../../model/model';

@Component({
  selector: 'app-image-entry',
  templateUrl: './image-entry.component.html',
  styleUrls: ['./image-entry.component.scss'],
})
export class ImageEntryComponent {
  @Input() public image: Image | null = null;
  @ViewChild('imageElement')
  public imageElement!: ElementRef<HTMLImageElement>;

  private fullscreenActive: boolean = false;

  public toggleFullscreen() {
    if (this.fullscreenActive && document.fullscreenElement) {
      document.exitFullscreen();
      this.fullscreenActive = false;
    } else if (!document.fullscreenElement) {
      this.imageElement.nativeElement.requestFullscreen();
      this.fullscreenActive = true;
    }
  }
}

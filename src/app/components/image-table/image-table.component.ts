import { Component, Input } from '@angular/core';
import { Artist, Image, Tag } from '../../model/model';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-image-table',
  templateUrl: './image-table.component.html',
  styleUrls: ['./image-table.component.scss'],
})
export class ImageTableComponent {
  @Input() public artistIds: string[] = [];
  @Input() public artists: { [id: string]: Artist } = {};
  @Input() public prompts: string[] = [];
  @Input() public promptMap: {
    [prompt: string]: { [artistId: string]: Image };
  } = {};
  @Input() public originalMap: { [artistId: string]: Image } = {};

  constructor(private filter: FilterService) {}

  getArtistName(artist: Artist) {
    let name = '';

    if (artist.honorific) {
      name += artist.honorific + ' ';
    }

    if (artist.firstName) {
      name += artist.firstName + ' ';
    }

    if (artist.middleName) {
      name += artist.middleName + ' ';
    }

    name += artist.lastName;

    if (artist.suffix) {
      name += ' ' + artist.suffix;
    }

    return name;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Artist, Image, Tag } from '../../model/model';
import { FilterService } from 'src/app/services/filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image-table',
  templateUrl: './image-table.component.html',
  styleUrls: ['./image-table.component.scss'],
})
export class ImageTableComponent implements OnInit {
  public artistIds: string[] = [];
  public artists: { [id: string]: Artist } = {};
  public prompts: string[] = [];
  public promptMap: {
    [prompt: string]: { [artistId: string]: Image };
  } = {};
  public originalMap: { [artistId: string]: Image } = {};

  private subscriptions: Subscription[] = [];

  constructor(private filter: FilterService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.filter.filteredArtistIds.subscribe((ids: string[]) => {
        this.artistIds = ids;
      })
    );
    this.subscriptions.push(
      this.filter.filteredArtistMap.subscribe(
        (artists: { [id: string]: Artist }) => {
          this.artists = artists;
        }
      )
    );
    this.subscriptions.push(
      this.filter.filteredPrompts.subscribe((prompts: string[]) => {
        this.prompts = prompts;
      })
    );
    this.subscriptions.push(
      this.filter.filteredPromptMap.subscribe(
        (promptMap: { [prompt: string]: { [artistId: string]: Image } }) => {
          this.promptMap = promptMap;
        }
      )
    );
    this.subscriptions.push(
      this.filter.filteredOriginalMap.subscribe(
        (originalMap: { [artistId: string]: Image }) => {
          this.originalMap = originalMap;
        }
      )
    );
  }

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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}

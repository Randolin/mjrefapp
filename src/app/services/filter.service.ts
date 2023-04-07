import { Injectable, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';
import { Artist, Image, Tag } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class FilterService implements OnDestroy {
  public artistIds: string[] = [];
  public artists: { [id: string]: Artist } = {};
  public imageIds: string[] = [];
  public images: { [id: string]: Image } = {};
  public prompts: string[] = [];
  public promptMap: { [prompt: string]: { [artistId: string]: Image } } = {};
  public originalMap: { [artistId: string]: Image } = {};
  public tags: Tag[] = [];

  private artistsSubscription!: Subscription;
  private imagesSubscription!: Subscription;
  private tagsSubscription!: Subscription;

  private MJID = '641e24fccf79831fc0bcf10c';

  constructor(private data: DataService) {
    this.artistsSubscription = this.data
      .getArtists()
      .subscribe((artists: Artist[]) => {
        this.refreshArtists(artists);
      });
    this.imagesSubscription = this.data
      .getImages()
      .subscribe((images: Image[]) => {
        this.refreshImages(images);
      });
    this.tagsSubscription = this.data.getTags().subscribe((tags: Tag[]) => {
      this.refreshTags(tags);
    });
  }

  refreshArtists(newArtists: Artist[]) {
    console.log(newArtists);
  }

  refreshImages(newImages: Image[]) {
    console.log(newImages);
  }

  refreshTags(newTags: Tag[]) {
    console.log(newTags);
  }

  ngOnDestroy() {
    this.artistsSubscription.unsubscribe();
    this.imagesSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }
}

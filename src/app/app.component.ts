import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Artist, Image, Tag } from './model/model';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
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

  constructor(private data: DataService) {}

  ngOnInit() {
    this.artistsSubscription = this.data
      .getArtists()
      .subscribe((artists: Artist[]) => {
        console.log(artists);
        let ids: string[] = [];
        let result: { [id: string]: Artist } = {};

        artists = artists.sort((a: Artist, b: Artist): number => {
          let nameA = a.lastName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
          let nameB = b.lastName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
          if (nameA > nameB) {
            return 1;
          } else {
            return -1;
          }
        });

        artists.forEach((artist) => {
          if (artist._id !== this.MJID) {
            ids.push(artist._id);
          }
          result[artist._id] = artist;
        });
        ids.splice(0, 0, this.MJID);

        this.artistIds = ids;
        this.artists = result;
      });

    this.imagesSubscription = this.data
      .getImages()
      .subscribe((images: Image[]) => {
        console.log(images);
        this.originalMap = {};
        this.promptMap = {};
        let ids: string[] = [];
        let prompts: string[] = [];
        let result: { [id: string]: Image } = {};

        images.forEach((image) => {
          ids.push(image._id);
          result[image._id] = image;

          if (image.artist && image.prompt) {
            if (!prompts.includes(image.prompt)) {
              prompts.push(image.prompt);
              this.promptMap[image.prompt] = {};
            }
            this.promptMap[image.prompt][image.artist] = image;
          }

          if (image.artist && image.original) {
            this.originalMap[image.artist] = image;
          }
        });

        this.prompts = prompts;
        this.imageIds = ids;
        this.images = result;
        console.log(this.promptMap);
      });

    this.tagsSubscription = this.data.getTags().subscribe((tags: Tag[]) => {
      console.log(tags);
      this.tags = tags;
    });
  }

  ngOnDestroy() {
    this.artistsSubscription.unsubscribe();
    this.imagesSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
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
}

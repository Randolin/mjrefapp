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
  private artistsSubscription!: Subscription;
  private imagesSubscription!: Subscription;
  private tagsSubscription!: Subscription;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.artistsSubscription = this.data
      .getArtists()
      .subscribe((artists: Artist[]) => {
        console.log(artists);
      });

    this.imagesSubscription = this.data
      .getImages()
      .subscribe((images: Image[]) => {
        console.log(images);
      });

    this.tagsSubscription = this.data.getTags().subscribe((tags: Tag[]) => {
      console.log(tags);
    });
  }

  ngOnDestroy() {
    this.artistsSubscription.unsubscribe();
    this.imagesSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }
}

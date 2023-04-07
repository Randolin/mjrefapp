import { Injectable, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, Observable, Subject, Subscription, from } from 'rxjs';
import { Artist, Image, Tag } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class FilterService implements OnDestroy {
  private filteredArtistIdsSubject: Subject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  private filteredArtistMapSubject: Subject<{ [id: string]: Artist }> =
    new BehaviorSubject<{ [id: string]: Artist }>({});
  private filteredImageIdsSubject: Subject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  private filteredImageMapSubject: Subject<{ [id: string]: Image }> =
    new BehaviorSubject<{ [id: string]: Image }>({});
  private filteredPromptsSubject: Subject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  private filteredPromptMapSubject: Subject<{
    [prompt: string]: { [artistId: string]: Image };
  }> = new BehaviorSubject<{
    [prompt: string]: { [artistId: string]: Image };
  }>({});
  private filteredOriginalMapSubject: Subject<{ [artistId: string]: Image }> =
    new BehaviorSubject<{ [artistId: string]: Image }>({});

  public filteredArtistIds: Observable<string[]> = from(
    this.filteredArtistIdsSubject
  );
  public filteredArtistMap: Observable<{ [id: string]: Artist }> = from(
    this.filteredArtistMapSubject
  );
  public filteredImageIds: Observable<string[]> = from(
    this.filteredImageIdsSubject
  );
  public filteredImageMap: Observable<{ [id: string]: Image }> = from(
    this.filteredImageMapSubject
  );
  public filteredPrompts: Observable<string[]> = from(
    this.filteredPromptsSubject
  );
  public filteredPromptMap: Observable<{
    [prompt: string]: { [artistId: string]: Image };
  }> = from(this.filteredPromptMapSubject);
  public filteredOriginalMap: Observable<{ [artistId: string]: Image }> = from(
    this.filteredOriginalMapSubject
  );

  private subscriptions: Subscription[] = [];
  private MJID = '641e24fccf79831fc0bcf10c';
  private tags: string[] = [];
  private tagMap: { [id: string]: Tag } = {};

  constructor(private data: DataService) {
    this.subscriptions.push(
      this.data.getArtists().subscribe((artists: Artist[]) => {
        this.refreshArtists(artists);
      })
    );
    this.subscriptions.push(
      this.data.getImages().subscribe((images: Image[]) => {
        this.refreshImages(images);
      })
    );
    this.subscriptions.push(
      this.data.getTags().subscribe((tags: Tag[]) => {
        this.refreshTags(tags);
      })
    );
  }

  sortArtistIds(
    artistIds: string[],
    artistMap: { [id: string]: Artist }
  ): string[] {
    let resultIds: string[] = [];

    artistIds = artistIds.sort((a, b) => {
      let aName: string = artistMap[a].lastName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      let bName: string = artistMap[b].lastName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      if (aName < bName) {
        return -1;
      } else if (aName > bName) {
        return 1;
      } else {
        return 0;
      }
    });

    artistIds.forEach((artistId) => {
      if (artistId !== this.MJID) {
        resultIds.push(artistId);
      }
    });
    resultIds.splice(0, 0, this.MJID);

    return resultIds;
  }

  refreshArtists(newArtists: Artist[]) {
    const filteredIds = newArtists.map((artist) => {
      return artist._id;
    });

    const artistMap: { [id: string]: Artist } = {};
    newArtists.forEach((artist) => {
      artistMap[artist._id] = artist;
    });

    const sortedIds = this.sortArtistIds(filteredIds, artistMap);

    this.filteredArtistIdsSubject.next(sortedIds);
    this.filteredArtistMapSubject.next(artistMap);
  }

  refreshImages(newImages: Image[]) {
    let prompts: string[] = [];
    let promptMap: { [prompt: string]: { [artistId: string]: Image } } = {};
    let originalMap: { [artistId: string]: Image } = {};

    const filteredIds = newImages.map((image) => {
      return image._id;
    });

    const imageMap: { [id: string]: Image } = {};
    newImages.forEach((image) => {
      imageMap[image._id] = image;

      if (image.artist && image.prompt) {
        if (!prompts.includes(image.prompt)) {
          prompts.push(image.prompt);
          promptMap[image.prompt] = {};
        }
        promptMap[image.prompt][image.artist] = image;
      }

      if (image.artist && image.original) {
        originalMap[image.artist] = image;
      }
    });

    this.filteredImageIdsSubject.next(filteredIds);
    this.filteredImageMapSubject.next(imageMap);
    this.filteredPromptsSubject.next(prompts);
    this.filteredPromptMapSubject.next(promptMap);
    this.filteredOriginalMapSubject.next(originalMap);
  }

  refreshTags(newTags: Tag[]) {
    const tagIds = newTags.map((tag) => {
      return tag._id;
    });

    const tagMap: { [id: string]: Tag } = {};
    newTags.forEach((tag) => {
      tagMap[tag._id] = tag;
    });

    this.tags = tagIds;
    this.tagMap = tagMap;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}

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
  private filteredTagIdsSubject: Subject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  private filteredTagMapSubject: Subject<{ [id: string]: Tag }> =
    new BehaviorSubject<{
      [id: string]: Tag;
    }>({});

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
  public filteredTagIds: Observable<string[]> = from(
    this.filteredTagIdsSubject
  );
  public filteredTagMap: Observable<{ [id: string]: Tag }> = from(
    this.filteredTagMapSubject
  );

  public activeTagFilters: string[] = [];

  private subscriptions: Subscription[] = [];
  private MJID = '641e24fccf79831fc0bcf10c';
  private artists: Artist[] = [];
  private images: Image[] = [];
  private tags: Tag[] = [];
  private artistTags: string[] = [];
  private imageTags: string[] = [];

  constructor(private data: DataService) {
    this.subscriptions.push(
      this.data.getArtists().subscribe((artists: Artist[]) => {
        this.updateArtists(artists);
      })
    );
    this.subscriptions.push(
      this.data.getImages().subscribe((images: Image[]) => {
        this.updateImages(images);
      })
    );
    this.subscriptions.push(
      this.data.getTags().subscribe((tags: Tag[]) => {
        this.updateTags(tags);
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

  refreshArtists(): void {
    const filteredArtists = this.artists.filter((artist) => {
      return (
        this.activeTagFilters.length === 0 ||
        artist.tags.some((tag) => {
          return this.activeTagFilters.includes(tag);
        })
      );
    });

    const filteredIds = filteredArtists.map((artist) => {
      return artist._id;
    });

    const artistMap: { [id: string]: Artist } = {};
    const newArtistTags: string[] = [];
    filteredArtists.forEach((artist) => {
      artist.tags.forEach((tag) => {
        if (!newArtistTags.includes(tag)) {
          newArtistTags.push(tag);
        }
      });

      artistMap[artist._id] = artist;
    });

    const sortedIds = this.sortArtistIds(filteredIds, artistMap);

    this.artistTags = newArtistTags;
    this.filteredArtistIdsSubject.next(sortedIds);
    this.filteredArtistMapSubject.next(artistMap);
  }

  updateArtists(newArtists: Artist[]): void {
    this.artists = newArtists;
    this.refreshArtists();
    this.refreshTags();
  }

  refreshImages(): void {
    let prompts: string[] = [];
    let promptMap: { [prompt: string]: { [artistId: string]: Image } } = {};
    let originalMap: { [artistId: string]: Image } = {};

    const filteredImages = this.images.filter((image) => {
      return (
        image.original ||
        this.activeTagFilters.length === 0 ||
        image.tags.some((tag) => {
          return this.activeTagFilters.includes(tag);
        })
      );
    });

    const filteredIds = filteredImages.map((image) => {
      return image._id;
    });

    const newImageTags: string[] = [];
    const imageMap: { [id: string]: Image } = {};
    filteredImages.forEach((image) => {
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

      image.tags.forEach((tag) => {
        if (!newImageTags.includes(tag)) {
          newImageTags.push(tag);
        }
      });
    });

    this.imageTags = newImageTags;
    this.filteredImageIdsSubject.next(filteredIds);
    this.filteredImageMapSubject.next(imageMap);
    this.filteredPromptsSubject.next(prompts);
    this.filteredPromptMapSubject.next(promptMap);
    this.filteredOriginalMapSubject.next(originalMap);
  }

  updateImages(newImages: Image[]): void {
    this.images = newImages;
    this.refreshImages();
    this.refreshTags();
  }

  refreshTags(): void {
    if (this.artistTags.length === 0 || this.imageTags.length === 0) {
      return;
    }

    let tags = this.tags.filter((tag) => {
      return (
        this.artistTags.includes(tag._id) || this.imageTags.includes(tag._id)
      );
    });
    const tagIds = tags
      .sort((tagA, tagB) => {
        return tagA.order > tagB.order ? 1 : -1;
      })
      .map((tag) => {
        return tag._id;
      });

    const tagMap: { [id: string]: Tag } = {};
    tags.forEach((tag) => {
      if (
        this.artistTags.includes(tag._id) ||
        this.imageTags.includes(tag._id)
      ) {
        tagMap[tag._id] = tag;
      }
    });

    this.filteredTagIdsSubject.next(tagIds);
    this.filteredTagMapSubject.next(tagMap);
  }

  updateTags(newTags: Tag[]): void {
    this.tags = newTags;
    this.refreshTags();
  }

  toggleTagFilter(tagId: string): void {
    if (this.activeTagFilters.includes(tagId)) {
      this.activeTagFilters = this.activeTagFilters.filter(
        (filter) => filter !== tagId
      );
    } else {
      this.activeTagFilters.push(tagId);
    }

    this.refreshArtists();
    this.refreshImages();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}

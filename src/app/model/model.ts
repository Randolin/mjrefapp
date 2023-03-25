export interface Artist {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  referenceUrl?: string;
  birthDate?: string;
  deathDate?: string;
  birthLocation?: Location | string;
  shortBio?: string;
  longBio?: string;
  representation: number;
  artistImage?: string;
  tags: string[];
  originalLandscapeImages: string[];
  originalPortraitImages: string[];
}

export interface Image {
  _id: string;
  src: string;
  version: number;
  original: boolean;
  prompt?: string;
  artist?: string;
  tags: string[];
}

export interface Location {
  _id: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Tag {
  _id: string;
  key: string;
  shortDescription?: string;
  longDescription?: string;
}

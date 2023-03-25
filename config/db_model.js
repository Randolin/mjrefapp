import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    firstName: String,
    middleName: String,
    lastName: String,
    referenceUrl: String,
    birthDate: String,
    deathDate: String,
    birthLocation: String,
    shortBio: String,
    longBio: String,
    representation: Number,
    artistImage: mongoose.Types.ObjectId,
    tags: [mongoose.Types.ObjectId],
    originalLandscapeImages: [mongoose.Types.ObjectId],
    originalPortraitImages: [mongoose.Types.ObjectId],
  },
  { collection: "artists" }
);

const ImageSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    src: String,
    version: Number,
    original: Boolean,
    prompt: String,
    artist: mongoose.Types.ObjectId,
    tags: [mongoose.Types.ObjectId],
  },
  { collection: "images" }
);

const LocationSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    city: String,
    state: String,
    country: String,
  },
  { collection: "locations" }
);

const TagSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    key: String,
    shortDescription: String,
    longDescription: String,
  },
  { collection: "tags" }
);

export { ArtistSchema, ImageSchema, LocationSchema, TagSchema };

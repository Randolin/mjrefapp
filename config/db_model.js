import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    firstName: String,
    lastName: String,
    referenceUrl: String,
    birthDate: String,
    deathDate: String,
    birthLocation: String,
    shortBio: String,
    longBio: String,
    representation: Number,
    artistImage: mongoose.Types.ObjectId,
    originalImages: [mongoose.Types.ObjectId],
    tags: [mongoose.Types.ObjectId],
  },
  { collection: "artists" }
);

const ImageSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    src: String,
    tags: [mongoose.Types.ObjectId],
    original: Boolean,
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

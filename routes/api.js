import { Router } from "express";
import { db } from "../config/db.js";
import {
  ArtistSchema,
  ImageSchema,
  LocationSchema,
  TagSchema,
} from "../config/db_model.js";

const router = Router();

const Artist = db.model("artists", ArtistSchema);
const Image = db.model("images", ImageSchema);
const Location = db.model("locations", LocationSchema);
const Tag = db.model("tags", TagSchema);

async function getArtists() {
  return await Artist.find({});
}

router.get("/artists", function (req, res) {
  getArtists().then((Artists) => {
    res.send(Artists);
  });
});

async function getImages() {
  return await Image.find({});
}

router.get("/images", function (req, res) {
  getImages().then((Images) => {
    res.send(Images);
  });
});

async function getLocations() {
  return await Location.find({});
}

router.get("/locations", function (req, res) {
  getLocations().then((Locations) => {
    res.send(Locations);
  });
});

async function getTags() {
  return await Tag.find({});
}

router.get("/tags", function (req, res) {
  getTags().then((Tags) => {
    res.send(Tags);
  });
});

export default router;

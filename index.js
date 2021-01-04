const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const app = express();

app.use(express.json());
app.use("view engine", "ejs");

const connString = "mongodb://localhost/GridFS";
const conn = mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

const storage = new GridFsStorage({
  url: connString,
  file: (req, file) => {
    return new Promise((reject, resolve) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };

        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

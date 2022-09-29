import path from "path";
import sharp from "sharp";
const fs = require("fs");

function Optimize(
  buffer,
  abspath,
  format = "jpeg",
  imageFit = "fill",
  width = null,
  height = null,
  quality = 80
) {
  const resizeOptions = {
    fit: imageFit,
  };
  const resized = (width && height) ? sharp(buffer).resize(width, height, resizeOptions) : sharp(buffer);

  const image = resized
    .toFormat(format, { quality: quality })
    .withMetadata()
    .toFile(`${abspath}.${format}`);
  return image;
}

export default async (req, res) => {

  const pattern = new RegExp(
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
  );
  const url = decodeURIComponent(req.query.url);
  const isRemote = pattern.test(url);
  let filename = ``;
  let result = null;
  let buffer = null;
  let filePath = ``;
  if (isRemote) {
    result = await fetch(url);
    buffer = await result.buffer();
    filename = url
      .split("/")
      .slice(-3)
      .join("/")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    console.log("remote", filename);
  } else {
    // let localPath = path.resolve(".", `${url}`);
    let localPath = path.join(process.cwd(), `${url}`);
    filename = path.basename(localPath);
    console.log("local", filename, localPath);
    buffer = fs.readFileSync(localPath);
  }
  res.setHeader("Cache-control", "public, max-age=86400, must-revalidate");

  switch (req.query.type) {
    case "thumbnail":
      // filePath = path.resolve(".", `/public/thumbnails/${filename}`);
      filePath = path.join(process.cwd(), `/public/thumbnails/${filename}`);
      if (fs.existsSync(`${filePath}.webp`)) {
        res.setHeader("Content-Type", "image/webp");
        var readStream = fs.createReadStream(`${filePath}.webp`);
        res.status(200);
        readStream.pipe(res);
      } else {
        await Optimize(
          buffer,
          filePath,
          "webp",
          "cover",
          170,
          170
        );
        var readStream = fs.createReadStream(`${filePath}.webp`);
        res.setHeader("Content-Type", "image/webp");
        res.status(200);
        readStream.pipe(res);
      }
      break;
    case "cover":
      // filePath = path.resolve(".", `/public/covers/${filename}`);
      filePath = path.join(process.cwd(), `/public/covers/${filename}`);
      if (fs.existsSync(`${filePath}.webp`)) {
        var readStream = fs.createReadStream(`${filePath}.webp`);
        res.setHeader("Content-Type", "image/webp");
        res.status(200);
        readStream.pipe(res);
      } else {
        await Optimize(
          buffer,
          filePath,
          "webp",
          "cover",
          500,
          500
        );
        var readStream = fs.createReadStream(`${filePath}.webp`);
        res.setHeader("Content-Type", "image/webp");
        res.status(200);
        readStream.pipe(res);
      }
      break;
      case "original":
        filePath = path.join(process.cwd(), `/public/og/${filename}`);
        console.log("original", filePath);
        if (fs.existsSync(`${filePath}.webp`)) {
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.setHeader("Content-Type", "image/webp");
          res.status(200);
          readStream.pipe(res);
        } else {
          await Optimize(
            buffer,
            filePath,
            "webp",
            "cover",
          );
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.setHeader("Content-Type", "image/webp");
          res.status(200);
          readStream.pipe(res);
        }
    default:
      break;
  }
};

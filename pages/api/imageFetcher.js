import path from "path";
import sharp from "sharp";
const fs = require("fs");

function Optimize(
  buffer,
  abspath = null,
  format = "webp",
  imageFit = "fill",
  width = null,
  height = null,
  quality = 60
) {
  const resizeOptions = {
    fit: imageFit,
  };
  const resized =
    width && height
      ? sharp(buffer).resize(width, height, resizeOptions)
      : sharp(buffer);

  const image = resized.toFormat(format, { force:true, quality: quality }).withMetadata();
  // if (abspath) {
  //   return image.toFile(`${abspath}.${format}`);
  // }
  return image.toBuffer();
}

export default async (req, res) => {
  const useBuffer = true; //Vercel won't save files to disk, so we need to use buffers
  const pattern = new RegExp(
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
  );
  const url = decodeURIComponent(req.query.url);
  const isRemote = pattern.test(url);
  let filename = ``;
  let result = null;
  let buffer = null;
  let filePath = ``;
  let resbuffer = null;
  
  if (isRemote) {
    result = await fetch(url);
    filename = url
      .split("/")
      .slice(-3)
      .join("/")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
  } else {
    let baseurl = "http://localhost:3000/"
    if(process.env.VERCEL_URL){
      baseurl = "https://"+process.env.VERCEL_URL+"/"
    }
    result = await fetch(`${baseurl}${url}`);
    
    filename = path.basename(url);
  }
  buffer = await result.buffer();

  res.setHeader("Cache-control", "public, max-age=86400, must-revalidate");

  switch (req.query.type) {
    case "thumbnail":
      if (useBuffer) {
        resbuffer = await Optimize(buffer, filePath, "webp", "cover", 170, 170);
        res.setHeader("Content-Type", "image/jpeg");
        res.send(resbuffer);
      } else {
        filePath = path.join(process.cwd(), `/public/thumbnails/${filename}`);
        if (fs.existsSync(`${filePath}.webp`)) {
          res.setHeader("Content-Type", "image/webp");
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.status(200);
          readStream.pipe(res);
        } else {
          await Optimize(buffer, filePath, "webp", "cover", 170, 170);
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.setHeader("Content-Type", "image/webp");
          res.status(200);
          readStream.pipe(res);
        }
      }
      break;
    case "cover":
      if (useBuffer) {
        resbuffer = await Optimize(buffer, filePath, "webp", "cover", 300, 300);

        res.setHeader("Content-Type", "image/jpeg");
        res.send(resbuffer);
      } else {
        filePath = path.join(process.cwd(), `/public/covers/${filename}`);
        if (fs.existsSync(`${filePath}.webp`)) {
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.setHeader("Content-Type", "image/webp");
          res.status(200);
          readStream.pipe(res);
        } else {
          await Optimize(buffer, filePath, "webp", "cover", 300, 300);
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.setHeader("Content-Type", "image/webp");
          res.status(200);
          readStream.pipe(res);
        }
      }
      break;
    case "original":
      if (useBuffer) {
        resbuffer = await Optimize(buffer, filePath, "webp", "cover");
        res.setHeader("Content-Type", "image/jpeg");
        res.send(resbuffer);
      } else {
        filePath = path.join(process.cwd(), `/public/og/${filename}`);
        console.log("original", filePath);
        if (fs.existsSync(`${filePath}.webp`)) {
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.setHeader("Content-Type", "image/webp");
          res.status(200);
          readStream.pipe(res);
        } else {
          await Optimize(buffer, filePath, "webp", "cover");
          var readStream = fs.createReadStream(`${filePath}.webp`);
          res.setHeader("Content-Type", "image/webp");
          res.status(200);
          readStream.pipe(res);
        }
      }
      break;
    default:
      break;
  }
};

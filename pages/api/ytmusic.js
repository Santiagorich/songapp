import { getYTMusic } from "../../utils/getYTMusic";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const YTLink = await getYTMusic(req.query.query);
  res.setHeader("Cache-control", "public, max-age=86400, must-revalidate");
  return res.status(200).send(YTLink);
}



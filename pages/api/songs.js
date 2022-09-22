import { getSongs } from "../../utils/getSongs";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const songres = await getSongs(req.query.query);
  if(songres.error){
    return res.status(400).json(songres);
  }
  return res.status(200).json(songres);
}


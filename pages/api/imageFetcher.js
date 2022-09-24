export default async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    const result = await fetch(url);
    const body = result.body;
    res.setHeader("Cache-control", "public, max-age=86400, must-revalidate");
    body.pipe(res);
  };
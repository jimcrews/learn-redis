const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");
const port = 3000;

const redisClient = Redis.createClient({
  legacyMode: true,
});
(async () => {
  await redisClient.connect();
})();
const DEFAULT_EXP = 3600;

const app = express();
app.use(cors());

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  const photos = await getOrSetCache(`photos?album=${albumId}`, async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos",
      { params: { albumId } }
    );
    return data;
  });

  res.json(photos);
});

app.get("/photos/:id", async (req, res) => {
  const photo = await getOrSetCache(`photos:${req.params.id}`, async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/photos/${req.params.id}`);
    return data;
  });

  res.json(photo);
});


function getOrSetCache(key, cb) {
  return new Promise((resolve, reject) => {
    // try to get the key from redis
    redisClient.get(key, async (error, data) => {
      if (error) return reject(error);
      console.log('CACHE HIT');
      if (data != null) return resolve(JSON.parse(data));
      console.log('CAHCE MISS');
      const freshData = await cb();
      // save dave to cache
      redisClient.setEx(key, DEFAULT_EXP, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

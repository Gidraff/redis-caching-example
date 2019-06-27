const express = require('express');
const fetch = require("node-fetch");
const redis = require('redis');

const app = express();

// create and connect redis client on local instance.
const client = redis.createClient(6379);

client.on('error', (err) => {
  console.log("Error" + err);
});

app.get('/photos', (req, res) => {
  // key to store results in redis store
  const photosRedisKey = 'user:photos';

  return client.get(photosRedisKey, (err, photos) => {
     if(photos) {
       return res.json({ source: 'cache', data: JSON.parse(photos) })
     } else {
       fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(photos => {
          client.setex(photosRedisKey, 3600, JSON.stringify(photos))
          return res.json({ source: 'api', data: photos})
        })
        .catch(error => {
          console.log(error)
          // send error to the client
          return res.json(error.toString())
        })
     }
  })
});

app.listen(3000, () => {
  console.log('Server listening on port:', 3000);
});

const db = require('./connection');
const { User, Whiskey } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  await cleanDB('User', 'users');
  await cleanDB('Whiskey', 'whiskeys');

  await User.create({
    username: 'Hunter',
    email: 'hunter@testmail.com',
    password: '123qwe',
  });

  await User.create({
    username: 'Gabby',
    email: 'gabby@testmail.com',
    password: '123qwe'
  });

  console.log('Users seeded');

  await Whiskey.create({
    name: 'Four Roses Single Barrel',
    img: 'four_roses.png',
    type: 'Kentucky Straight Bourbon',
    distiller: 'Four Roses',
    country: 'USA',
    region: 'Kentucky',
    bottler: 'Original bottling',
    abv: 50,
    notes: [{
      nose: ['fruit', 'sweet', 'oak', 'spices', 'vanilla'],
      taste: ['sweet', 'fruit', 'oak', 'spices', 'caramel'],
      finish: ['sweet', 'oak', 'spices', 'nuts', 'vanilla'],
    }],
    score: 4
  });

  await Whiskey.create({
    name: 'Blantons Original',
    img: 'blantons.png',
    type: 'Kentucky Straight Bourbon',
    distiller: 'Buffalo Trace',
    country: 'USA',
    region: 'Kentucky',
    bottler: 'Original bottling',
    abv: 46.5,
    notes: [{
      nose: ['sweet', 'vanilla', 'caramel', 'oak', 'fruit'],
      taste: ['sweet', 'oak', 'caramel', 'vanilla'],
      finish: ['sweet', 'oak', 'vanilla',],
    }],
    score: 4.3
  });

  console.log('Whiskeys seeded');

  process.exit();
});

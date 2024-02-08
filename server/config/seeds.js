const db = require('./connection');
const { User } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  await cleanDB('User', 'users');

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

  console.log('users seeded');

  process.exit();
});

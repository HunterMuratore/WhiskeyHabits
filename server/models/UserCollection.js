const { Schema, model } = require('mongoose');

const UserCollectionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      whiskeyId: {
        type: Schema.Types.ObjectId,
        ref: 'Whiskey',
        required: true,
      },
      rating: {
        type: Number,
        min: 0,
        max: 10,
      },
      notes: {
        nose: String,
        taste: String,
        finish: String,
      },
});

// Populate the userId and whiskeyId fields when querying
UserCollectionSchema.pre(/^find/, function (next) {
  this.populate('userId').populate('whiskeyId');
  next();
});

const UserCollection = model('UserCollection', UserCollectionSchema);

module.exports = UserCollection;

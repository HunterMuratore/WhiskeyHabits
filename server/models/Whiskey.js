const { Schema, model } = require('mongoose');

const whiskeySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    type: {
        type: String,
    },
    rating: {
        type: Number,
    },
    link: {
        type: String,
    },
    image: {
        type: String,
    },
    stats: {
        distiller: {
            type: String,
        },
        bottler: {
            type: String,
        },
        abv: {
            type: String,
        },
        age: {
            type: String,
        },
        price: {
            type: String,
        },
    },
    houseReviews: {
        intro: {
            type: String,
        },
        nose: [{
            type: String,
        }],
        taste: [{
            type: String,
        }],
        finish: [{
            type: String,
        }],
        overall: {
            type: String,
        },
        score: {
            type: String,
        },
    },
});

const Whiskey = model('Whiskey', whiskeySchema);

module.exports = Whiskey;

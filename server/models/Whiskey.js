const { Schema, model } = require('mongoose');

const whiskeySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    img: {
        type: String,
    },
    type: {
        type: String, // Make into own model and reference here?
    },
    distiller: {
        type: String, // Make into own model and reference here?
    },
    country: {
        type: String,
    },
    region: {
        type: String
    },
    bottler: {
        type: String,
    },
    abv: {
        type: Number,
    },
    age: {
        type: String,
    },
    price: {
        type: Number,
    },
    notes: [{
        nose: [{
            type: String,
        }],
        taste: [{
            type: String,
        }],
        finish: [{
            type: String,
        }],
    }],
    score: {
        type: Number,
    },
});

const Whiskey = model('Whiskey', whiskeySchema);

module.exports = Whiskey;

//создание схемы-модели машины для БД
const { Schema, model } = require('mongoose');

const schema = new Schema({
    photo: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    price: { type: String, required: true }
});

module.exports = model('Car', schema);
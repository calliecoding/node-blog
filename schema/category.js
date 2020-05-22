
const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name:String
});

module.exports = mongoose.model('categories',categorySchema)
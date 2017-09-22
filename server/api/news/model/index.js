/**
 * Created by Ali on 15/09/2017.
 */
const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  date: Date,
  headline: String,
  slugline: String,
  content: String,
  thumbnailImage: String
})

module.exports = mongoose.model('News', newsSchema)

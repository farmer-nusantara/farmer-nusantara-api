const mongoose = require('mongoose');
const { Schema } = mongoose;

const modelSchema = new Schema({
  plantName: {
    type: String,
    required: true,
  },
});

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Text,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  likes: {
    type: Number,
  },
  dislikes: {
    type: Number,
  },
  publish: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    default: Date.now(),
  },
});

const faqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: Text,
    required: true,
  },
})

const model = mongoose.model('models', modelSchema);
const articleModel = mongoose.model('articles', articleSchema);
const faqModel = mongoose.model('models', faqSchema);

module.exports = { model, articleModel, faqModel };
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
    type: String,
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
    type: String,
    required: true,
  },
})

const model = mongoose.model('ModelsDL', modelSchema);
const articleModel = mongoose.model('Articles', articleSchema);
const faqModel = mongoose.model('Models', faqSchema);

module.exports = { model, articleModel, faqModel };
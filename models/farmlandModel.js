const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmlandSchema = new Schema({
  farmName: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  markColor: {
    type: String,
    required: true,
    unique: true,
  },
  plantType: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  imageUrl: {
    type: String,
    default: null,
  }
})

const farmlandModel = mongoose.model("Farmlands", farmlandSchema);

module.exports = farmlandModel;
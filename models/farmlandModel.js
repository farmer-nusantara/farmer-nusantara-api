const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmlandSchema = new Schema({
  farmName: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
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
  },
  sickPlants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SickPlants",
      default: null,
    }
  ],
})

const farmlandModel = mongoose.model("Farmlands", farmlandSchema);

module.exports = farmlandModel;
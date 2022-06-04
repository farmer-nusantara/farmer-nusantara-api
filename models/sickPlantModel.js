const mongoose = require('mongoose');
const { Schema } = mongoose;

const sickPlantSchema = new Schema({
  farmland_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmlands"
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  diseasePlant: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: String,
    default: Date.now(),
  },
  picturedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  }
});

const sickPlantModel = mongoose.model('SickPlants', sickPlantSchema);

module.exports = sickPlantModel;
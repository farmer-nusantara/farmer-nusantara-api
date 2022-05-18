const mongoose = require('mongoose');
const { Schema } = mongoose;

const sickPlantSchema = new Schema({
  farmland_id: {
    type: String,
    required: true,
  },
  coordinate: {
    type: String,
  },
  diseasePlant: {
    type: String,
  },
  imageUrl: {
    type: String,
  }
});

const sickPlantModel = mongoose.model('sickPlants', sickPlantSchema);

module.exports = sickPlantModel;
const sickPlantModel = require('../models/sickPlantModel');
const farmlandModel = require('../models/farmlandModel');
const { check } = require('express-validator');

module.exports = {
  createSickPlant: async (req, res, next) => {
    try {
      const { farmland_id, coordinate, diseasePlant, imageUrl, picturedBy } = req.body;

      const sickPlant = await sickPlantModel.create({
        farmland_id,
        coordinate,
        diseasePlant,
        imageUrl,
        picturedBy
      });

      if (sickPlant) {
        try {
          await farmlandModel.updateOne({ _id: farmland_id }, { $push: { sickPlants: sickPlant._id } });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }

      return res.status(201).json({ message: 'Save sick plant was successfully', data: sickPlant });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getSickPlant: async (req, res, next) => {
    try {
      const { sickPlantId } = req.params;

      const plant = await sickPlantModel.findById(sickPlantId).populate('picturedBy');

      if (!plant) return res.status(404).json({ message: 'Sick plant not found' });

      return res.status(200).json(plant);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getAllSickPlantsByFarmland: async (req, res, next) => {
    try {
      const { farmland_id } = req.query;

      if (!farmland_id) return res.status(422).send('farmland id query is required');

      const plants = await sickPlantModel.find({ farmland_id }).select({ _id: 1, createdAt: 1, diseasePlant: 1, coordinate: 1 });

      if (!plants) return res.status(404).send("farmland_id not found");

      return res.status(200).json(plants);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  removeSickPlant: async (req, res, next) => {
    try {
      const { farmlandId } = req.params;
      const { sickPlantId } = req.body;

      
      const plant = await sickPlantModel.findByIdAndDelete(sickPlantId);

      if (!plant) return res.status(404).send('Sick plant not found');
      
      const farmland = await farmlandModel.updateOne({ _id: farmlandId }, { $pull: { sickPlants: sickPlantId } } );

      return res.status(200).json({ message: 'Delete Sick plant was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  validates: (method) => {
    switch (method) {
      case 'createSickPlant': {
        return [
          check('farmland_id')
            .exists()
            .withMessage('farmland_id is required'),
          check('coordinate')
            .exists()
            .withMessage('coordinate is required'),
          check('diseasePlant')
            .exists()
            .withMessage('coordinate is required'),
          check('imageUrl')
            .exists()
            .withMessage('coordinate is required'),
        ]
      }
    }
  },
}
const sickPlantModel = require('../models/sickPlantModel');
const farmlandModel = require('../models/farmlandModel');
const { check } = require('express-validator');

module.exports = {
  createSickPlant: async (req, res, next) => {
    try {
      const { farmland_id, diseasePlant, imageUrl, picturedBy, latitude, longitude } = req.body;

      const sickPlant = await sickPlantModel.create({
        farmland_id,
        latitude,
        longitude,
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
  getAllSickPlants: async (req, res, next) => {
    try {
      const { farmland_id, owner } = req.query;
      
      if (!farmland_id && !owner) return res.status(422).json({ message: "Query not found" })
      
      let plants;
      if (farmland_id && !owner) {
        plants = await sickPlantModel.find({ farmland_id });
        return res.status(200).json(plants);
      } 
      
      if (owner && !farmland_id) {
        plants = await sickPlantModel.find({ picturedBy: owner })
          .populate({ path: "farmland_id", select: { farmName: 1, plantType: 1 } })
          .populate({ path: "picturedBy", select: { name: 1, email: 1 } });
        return res.status(200).json(plants);
      }
      
      return res.status(200).json({ message: "Farmland not created yet"});
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
      
      await farmlandModel.updateOne({ _id: farmlandId }, { $pull: { sickPlants: sickPlantId } } );

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
          check('latitude')
            .exists()
            .withMessage('latitude is required'),
          check('longitude')
            .exists()
            .withMessage('latitude is required'),
          check('diseasePlant')
            .exists()
            .withMessage('diseasePlant is required'),
          check('imageUrl')
            .exists()
            .withMessage('imageUrl is required'),
        ]
      }
    }
  },
}
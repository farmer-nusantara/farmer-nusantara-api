const sickPlantModel = require('../models/sickPlantModel');
const { check } = require('express-validator');

module.exports = {
  createSickPlant: async (req, res, next) => {
    try {
      const { farmland_id, coordinate, diseasePlant, imageUrl } = req.body;

      const sickPlant = await sickPlantModel.create({
        farmland_id,
        coordinate,
        diseasePlant,
        imageUrl
      });

      return res.status(201).json({ message: 'Save sick plant was successfully', data: sickPlant });
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
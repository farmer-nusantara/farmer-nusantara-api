const sickPlantModel = require('../models/sickPlantModel');
const { check } = require('express-validator');

module.exports = {
  createSickPlant: async (req, res, next) => {
    try {
      const { coordinate, diseasePlant, imageUrl, picturedBy } = req.body;
      const { farmlandId } = req.params;

      const sickPlant = await sickPlantModel.create({
        farmland_id: farmlandId,
        coordinate,
        diseasePlant,
        imageUrl,
        picturedBy
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
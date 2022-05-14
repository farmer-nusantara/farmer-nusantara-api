const farmlandModel = require('../models/farmlandModel');
const { check } = require('express-validator');

module.exports = {
  createFarmland: async (req, res, next) => {
    try {
      const { farmName, owner, markColor, plantType, location, farmCover } = req.body;

      const farmland = await farmlandModel.create({
        farmName,
        owner,
        markColor,
        plantType,
        location,
        farmCover,
      });

      return res.status(201).json(farmland);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  validates: (method) => {
    switch (method) {
      case "createFamland": {
        return [
          check('farmName')
            .exists()
            .notEmpty()
            .trim()
            .withMessage("farmName is required")
            .custom((value, { req }) => {
              return farmlandModel.find({
                $and: [
                  {
                    farmName: { $eq: value },
                  },
                  {
                    owner: { $eq: req.body.owner },
                  }
                ]
              }).then(user => {
                  if (user) return Promise.reject('farmName is already in used');
                })
            }),
          check('owner')
            .exists()
            .withMessage('Owner is required'),
          check('markColor')
            .exists()
            .withMessage("markColor is required")
            .custom((value, { req }) => {
              return farmlandModel.find({
                $and: [
                  {
                    markColor: { $eq: value },
                  },
                  {
                    owner: { $eq: req.body.owner },
                  }
                ]
              }).then(user => {
                if (user) return Promise.reject('markColor is already in used');
              })
            }),
          check('plantType')
            .exists()
            .withMessage("plantType is required"),
          check('location')
            .exists()
            .withMessage("Location is required"),
          check('farmCover')
            .custom(value => {
              return farmlandModel.find({ farmCover: value })
                .then(farmland => {
                  if (farmland) return Promise.reject('farmCover name is already in used')
                })
            })
        ]
      }
    }
  }
};
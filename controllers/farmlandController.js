const farmlandModel = require('../models/farmlandModel');
const { check } = require('express-validator');
const util = require('util');
const { uploadImage, removeImage } = require('../utils/uploadImage');

module.exports = {
  createFarmland: async (req, res, next) => {
    try {
      const { farmName, owner, markColor, plantType, location, imageUrl } = req.body;

      const farmland = await farmlandModel.create({
        farmName,
        owner,
        markColor,
        plantType,
        location,
        imageUrl,
      });

      return res.status(201).json(farmland);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  showAllFarmlandByOwner: async (req, res, next) => {
    try {
      const { owner } = req.query;

      if (!owner) return res.status(422).send('Mush have query owner');

      const farmlands = await farmlandModel.find({ owner });

      return res.status(200).json(farmlands);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  showFarmlandById: async (req, res, next) => {
    try {
      const { farmlandId } = req.params;
      
      const farmland = await farmlandModel.findById(farmlandId);
      if (!farmland) return res.status(404).send('farmland not found');

      return res.status(200).json(farmland);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  uploadImageToStorage: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const image = req.file;
      const imageUrl = await uploadImage(image, userId, 'farmcover');

      res.status(200).json({
        message: "Upload was successful",
        imageUrl
      })
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  removeImageFromStorage: async (req, res, next) => {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) return res.status(422).send('Should have image url for delete image');

      const image = await removeImage(imageUrl);
      
      if (!image) return res.status(404).json({ message: 'Delete was failed' });

      return res.status(200).json({ message: 'Delete was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  updateFarmland: async (req, res, next) => {
    try {
      const { farmlandId } = req.params;
      const { farmName, owner, markColor, plantType, location, imageUrl } = req.body;

      if (!farmlandId) return res.status(422).send("Should have params farmland id");

      const farmland = await farmlandModel.findByIdAndUpdate(farmlandId, {
        farmName,
        owner,
        markColor,
        plantType,
        location,
        imageUrl,
      });

      if (!farmland) return res.status(404).send('Farmland Id not found');

      return res.status(201).json({ message: 'Farmland update was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  removeFarmland: async (req, res, next) => {
    try {
      const { farmlandId } = req.params;

      if (!farmlandId) return res.status(422).send("Should have params farmland id");

      const farmland = await farmlandModel.findByIdAndRemove(farmlandId);

      if (!farmland) return res.status(404).send('Farmland not found');

      return res.status(200).json({ message: 'Farmland delete was successfully' });
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
          check('imageUrl')
            .custom(value => {
              return farmlandModel.find({ farmCover: value })
                .then(farmland => {
                  if (farmland) return Promise.reject('imageUrl name is already in used')
                })
            })
        ]
      }
    }
  }
};
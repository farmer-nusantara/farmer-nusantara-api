const farmlandModel = require('../models/farmlandModel');
const { check } = require('express-validator');
const multer = require('multer');
const util = require('util');
const path = require('path');

function checkFileType(file, cb) {
	// Allowed ext
	const fileTypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimeType = fileTypes.test(file.mimetype);

	if (mimeType && extName) {
		return cb(null, true);
	} else {
		cb("Error: Images Only !!!");
	}
}

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
  uploadFarmCover: async (req, res, next) => {
    const { userId } = req.params;

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "temp/");
      },
      filename: (req, file, cb) => {
        cb(null, userId + '-' + Date.now() + path.extname(file.originalname).toLowerCase());
      },
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 2000000 },
      fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
      },
    }).single("image");

    let uploadFile = util.promisify(upload);

    try {
      await uploadFile(req, res);
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }

      res.status(200).json({
        message: "Uploaded the file successfully",
        filename: req.file.filename,
      });

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
const { check } = require("express-validator");
const { model } = require("../models/adminPanelModel");

module.exports = {
  getModels: async (req, res) => {
    try {
      const data = await model.find({});
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  addModel: async (req, res) => {
    try {
      const { plantName } = req.body;
      await model.create({ plantName: plantName });
      return res.status(201).json({ message: "add model was successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  editModel: async (req, res) => {
    try {
      const { id } = req.params;
      const { plantName } = req.body;
      await model.findByIdAndUpdate(id, { plantName: plantName });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deleteModel: async (req, res) => {
    try {
      const { id } = req.params;
      await model.findByIdAndRemove(id);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  validates: (method) => {
    switch (method) {
      case "addModel": {
        return [
          check('plantName')
            .exists()
            .withMessage('plantName is required'),
        ]
      }

      case "editModel": {
        return [
          check('plantName')
            .exists()
            .withMessage('plantName is required'),
        ]
      }
    }
  }
}
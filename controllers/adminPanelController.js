const { check } = require("express-validator");
const { model, articleModel, faqModel } = require("../models/adminPanelModel");
const farmlandModel = require("../models/farmlandModel");
const sickPlantModel = require("../models/sickPlantModel");
const { userModel } = require("../models/userModel");

module.exports = {
  getModels: async (req, res) => {
    console.log(req.user);
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
      return res.status(200).json({ message: 'update dl model was successfully' })
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deleteModel: async (req, res) => {
    try {
      const { id } = req.params;
      await model.findByIdAndRemove(id);
      return res.status(200).json({ message: 'delete model was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getArticles: async (req, res) => {
    try {
      const data = await articleModel.find({});
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getArticleById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await articleModel.findById(id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  addArticle: async (req, res) => {
    try {
      const {
        title,
        content,
        imageUrl,
      } = req.body;
      await articleModel.create({
        title,
        content,
        imageUrl,
      });
      return res.status(201).json({ message: 'add article was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  editArticle: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        content,
        imageUrl,
      } = req.body;
      await articleModel.findByIdAndUpdate(id, {
        title,
        content,
        imageUrl
      });
      return res.status(200).json({ message: 'article update was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deleteArticle: async (req, res) => {
    try {
      const { id } = req.params;
      await articleModel.findByIdAndRemove(id);
      return res.status(200).json({ message: 'article delete was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getFaqs: async (req, res) => {
    try {
      const data = await faqModel.find({});
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  addFaq: async (req, res) => {
    try {
      const { question, answer } = req.body;
      await faqModel.create({ question, answer });
      return res.status(201).json({ message: 'add FAQ was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  editFaq: async (req, res) => {
    try {
      const { id } = req.params;
      const { question, answer } = req.body;
      await faqModel.findByIdAndUpdate(id, { question, answer });
      return res.status(201).json({ message: 'update FAQ was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deleteFaq: async (req, res) => {
    try {
      const { id } = req.params;
      await faqModel.findByIdAndRemove(id);
      return res.status(200).json({ message: 'delete faq was successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getDashboardData: async (req, res) => {
    try {
      const users = await userModel.count({});
      const farmlands = await farmlandModel.count({});
      const sickPlants = await sickPlantModel.count({});
      const deepLearningModel = await model.count({});

      return res.status(200).json({
        users,
        farmlands,
        sickPlants,
        deepLearningModel,
      })
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
        ];
      };
      case "editModel": {
        return [
          check('plantName')
            .exists()
            .withMessage('plantName is required'),
        ];
      }
      case "addArticle": {
        return [
          check('title')
            .exists()
            .withMessage('title is required'),
          check('content')
            .exists()
            .withMessage('content is required'),
          check('imageUrl')
            .exists()
            .withMessage('imageUrl is required'),
        ];
      }
      case "addFaq": {
        return [
          check('question')
            .exists()
            .withMessage('question is required'),
          check('answer')
            .exists()
            .withMessage('answer is required')
        ]
      }
    }
  }
}
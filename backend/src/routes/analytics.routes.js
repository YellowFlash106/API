const express = require("express");

const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/overview", authMiddleware, analyticsController.getOverView);

module.exports = router;
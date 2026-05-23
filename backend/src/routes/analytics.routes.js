const express = require("express");

const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/overview", authMiddleware, analyticsController.getOverView);
router.get("/services", authMiddleware, analyticsController.getServiceAnalytics);
router.get("/users", authMiddleware, analyticsController.getUserAnalytics);
router.get("/errors", authMiddleware, analyticsController.getErrorAnalytics);
router.get("/daily", authMiddleware, analyticsController.getDailyAnalytics);

module.exports = router;
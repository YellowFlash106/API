const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, serviceController.getAllServices);
router.post("/", authMiddleware, serviceController.creataServices);

module.exports = router;

const express = require("express");
const router = express.Router();

const { createApiKey } = require("../controllers/apiKey.controller");

const authMiddlware = require("../middleware/auth.middleware");

router.post("/", authMiddlware, createApiKey);

module.exports = router;
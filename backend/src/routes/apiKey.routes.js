const express = require("express");
const router = express.Router();

const { createApiKey, listApiKeys, revokeApiKey } = require("../controllers/apiKey.controller");

const authMiddlware = require("../middleware/auth.middleware");

router.get("/", authMiddlware, listApiKeys);
router.post("/", authMiddlware, createApiKey);
router.put("/:id/revoke", authMiddlware, revokeApiKey);

module.exports = router;
const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/service.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const validate = require('../middleware/validate.middleware.js');
const { createServiceSchema } = require('../validations/service.validation.js');

router.get("/", authMiddleware, serviceController.getAllServices);
router.post("/", authMiddleware, validate(createServiceSchema), serviceController.createService);
router.post("/:id/request", authMiddleware, serviceController.requestService);
router.post("/:id/approve", authMiddleware, serviceController.approveService);

module.exports = router;
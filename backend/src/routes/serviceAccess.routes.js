const express = require('express');
const router = express.Router();
    
const controller = require('../controllers/serviceAccess.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.get("/", authMiddleware, controller.getUserAccesses);
router.post("/", authMiddleware, controller.requestAccess);
router.put("/:id/approve", authMiddleware, controller.approveAccess);
router.put("/:id/reject", authMiddleware, controller.rejectAccess);

module.exports = router;
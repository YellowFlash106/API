(function () {
	const express = require("express");
	const router = express.Router();

	// Example service routes - add your handlers in ../controllers/service.controller.js
	const serviceController = require("../controllers/service.controller");

	router.get("/", serviceController && serviceController.getAll ? serviceController.getAll : (req, res) => res.json({ services: [] }));

	module.exports = router;
})();

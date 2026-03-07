require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const authMod = require("./routes/auth.routes");
const authRoutes = authMod && authMod.default ? authMod.default : authMod;
const serviceMod = require("./routes/service.routes");
const serviceRouters = serviceMod && serviceMod.default ? serviceMod.default : serviceMod;
const _apiKeyMiddleware = require("./middleware/apiKey.middleware");
const apiKeyMiddleware = _apiKeyMiddleware && _apiKeyMiddleware.default ? _apiKeyMiddleware.default : _apiKeyMiddleware;
const { runExampleServices } = require("./services/example.service");


app.use("/auth", authRoutes);
app.use("/services", serviceRouters);
app.use(apiKeyMiddleware);


app.get("/api/example", apiKeyMiddleware, runExampleServices);
app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
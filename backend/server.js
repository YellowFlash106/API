require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const serviceRouters = require("./routes/service.routes");
const apiKeyMiddleware = require("./middleware/apiKey.middleware");
const { runExampleServices } = require("./services/example.service");


app.use("/auth", authRoutes);
app.use("/services", serviceRouters);


app.get("/api/example", apiKeyMiddleware, runExampleServices);
app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
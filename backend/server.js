require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const prisma = require("./src/utils/prisma.js");
const serviceRoutes = require("./src/routes/service.routes.js");
const apiKeyRoutes = require("./src/routes/apiKey.routes.js");
const authMod = require("./src/routes/auth.routes");
const serviceMod = require("./src/routes/service.routes");
const analyticsRoutes = require("./src/routes/analytics.routes");
const apiKeyMiddleware = require("./src/middleware/apiKey.middleware");
const rateLimitMiddleware = require("./src/middleware/rateLimit.middleware");
const loggingMiddleware = require("./src/middleware/logging.middleware");
const { runExampleServices } = require("./src/services/example.service");
const errorHandler = require("./src/middleware/error.middleware.js");


app.use("/auth", authMod);
app.use("/services", serviceMod);
app.use("/apikeys", apiKeyRoutes);
app.use("/api", loggingMiddleware);
app.use("/api", rateLimitMiddleware);
app.use("/api/services", serviceRoutes);
app.use("/analytics", analyticsRoutes);
app.use(errorHandler);


app.get("/api/example", apiKeyMiddleware, runExampleServices);
app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



// You are building a **full-stack API Gateway and Developer Platform** where you act as a service provider and other developers act as consumers of your APIs. In this system, you create reusable backend services (like email APIs, data APIs, or utility services) and expose them through a centralized platform. Developers can sign up, log in, and browse the available services through a dashboard. If they want to use a service, they request access, and once approved, they receive a unique API key. This key is then used to authenticate their requests when they call your APIs. The platform ensures that only authorized users can access specific services, making it a controlled and scalable way to share backend functionality.

// At the core of your project is an **API Gateway layer** that sits between the users and your services. This gateway handles critical responsibilities such as validating API keys, checking permissions, applying rate limits, and logging requests before forwarding them to the actual service. Behind the scenes, the system uses a structured backend architecture with authentication (JWT), a database to store users, services, and API keys, and middleware to manage request flow securely. On top of this, a React-based dashboard provides a user-friendly interface for managing access and monitoring usage. Overall, you are building a system similar in concept to platforms like RapidAPI or cloud API management tools, which is a strong demonstration of backend engineering, system design, and API security concepts.
// this is my project so i want you to tell me that how can i make it more unique from reguler api projects and if some one ask me that which problem is it solving in real world so for that give me some idea that will help me answer these type of question 

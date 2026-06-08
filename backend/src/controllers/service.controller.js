let Services = [
    {
        id:1,
        name:"Example Service",
        description:"Simple test service",
        endpoint:"/api/services/example"
    }
];

const prisma = require('../utils/prisma.js');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getAllServices = asyncHandler(async (req, res) => {
    const services = await prisma.service.findMany(); 
    res.json(services);
});

exports.createService = asyncHandler(async (req, res) => {
    const { name, description, endpoint } = req.body;

    const newService = await prisma.service.create({
        data: {
            name,
            description,
            endpoint
        }
    });
    res.status(201).json(newService);
});

exports.requestService = asyncHandler(async (req, res) => {
    const userId = req.user?.id ?? req.body.userId ?? req.body.id;
    const serviceId = parseInt(req.params.id, 10);

    if (Number.isNaN(serviceId)) {
        throw new AppError("Invalid service id", 400);
    }

    if (!userId) {
        throw new AppError("userId is required in body", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const request = await prisma.serviceAccess.create({
        data: {
            userId,
            serviceId
        }
    });
    res.json(request);
});

exports.approveService = asyncHandler(async (req, res) => {
    if (req.user?.role !== "admin") {
        throw new AppError("Forbidden: Only administrators can approve service requests", 403);
    }

    const userId = req.user?.id ?? req.body.userId ?? req.body.id;
    const serviceId = parseInt(req.params.id, 10);

    if (Number.isNaN(serviceId)) {
        throw new AppError("Invalid service id", 400);
    }

    if (!userId) {
        throw new AppError("userId is required in body", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const access = await prisma.serviceAccess.updateMany({
        where: {
            userId,
            serviceId
        },
        data: {
            approved: true
        }
    });
    res.json(access);
});


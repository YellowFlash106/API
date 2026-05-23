let Services = [
    {
        id:1,
        name:"Example Service",
        description:"Simple test service",
        endpoint:"/api/services/example"
    }
];

const prisma = require('../utils/prisma.js');

exports.getAllServices = async (req, res) =>{
    const services = await prisma.service.findMany(); 
    res.json(services);
}

exports.createService = async (req, res) =>{
    const { name, description, endpoint } = req.body;

    const newService = await prisma.service.create({
        data: {
            name,
            description,
            endpoint
        }
    });
    res.json(newService);
}

exports.requestService = async (req, res) =>{
    const userId = req.body.userId ?? req.body.id;
    const serviceId = parseInt(req.params.id);

    if (!userId) {
        return res.status(400).json({ message: "userId is required in body" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const request = await prisma.serviceAccess.create({
        data: {
            userId,
            serviceId
        }
    });
    res.json(request);
}

exports.approveService = async (req, res) =>{

    const userId = req.body.userId ?? req.body.id;
    const serviceId = parseInt(req.params.id);

    if (!userId) {
        return res.status(400).json({ message: "userId is required in body" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // if (req.user.role !== "admin") {
    //   return res.status(403).send("Only admin allowed");
    // }
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
}


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

    const userId = req.body.id;
    const serviceId = parseInt(req.params.id);


    const request = await prisma.serviceAccess.create({
        data: {
            userId,
            serviceId
        }
    });
    res.json(request);
}

exports.approveService = async (req, res) =>{

    const {userId }= req.body.id;
    const serviceId = parseInt(req.params.id);

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


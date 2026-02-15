let Services = [
    {
        id:1,
        name:"Example Service",
        description:"Simple test service",
    }
];

exports.getAllServices = (req, res) =>{
    res.json(Services);
}
exports.creataServices = (req, res) =>{
    const { name, description } = req.body;

    const newService ={
        id:Date.now(),
        name, description,
    }

    Services.push(newService);
    res.json(newService);
}

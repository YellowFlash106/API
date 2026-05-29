const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');

const AppError = require('../utils/appError');

exports.requestAccess = asyncHandler(async (req, res)=>{
    const userId = req.user.id;
    const { serviceId} = req.body;

    const existing = await prisma.serviceAccess.findUnique({
        where:{
            userId_serviceId:{
                userId,
                serviceId
            }
        }
    })
    if(existing){
        throw new AppError("Access request already exists", 400);
    }

    const request = await prisma.serviceAccess.create({
        data:{
            userId,
            serviceId
        }
    });

    res.json({
        message: "Access request created",
        request
    })
})


exports.approveAccess = asyncHandler(async ( req, res)=>{
    const {id} = req.params;

    const updated = await prisma.serviceAccess.update({
        where:{ id : Number(id)},
        data :{ status: "approved"}
    })
    res.json({ message : "Access request approved", updated});
})

exports.rejectAccess = asyncHandler(async ( req, res)=>{
    const {id} = req.params;

    const updated = await prisma.serviceAccess.update({
        where:{ id : Number(id)},
        data :{ status: "rejected"}
    })
    res.json({ message : "Access request rejected", updated});
})


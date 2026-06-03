const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');

const AppError = require('../utils/AppError');

exports.requestAccess = asyncHandler(async (req, res)=>{
    const userId = req.user?.id;
    const { serviceId} = req.body;

    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    if (!serviceId) {
        throw new AppError("serviceId is required", 400);
    }

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


exports.getUserAccesses = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    if (req.user.role === "admin") {
        const accesses = await prisma.serviceAccess.findMany({
            include: {
                user: { select: { id: true, email: true } },
                service: { select: { id: true, name: true, description: true } }
            }
        });
        return res.json(accesses);
    }

    const accesses = await prisma.serviceAccess.findMany({
        where: { userId },
        include: {
            service: { select: { id: true, name: true, description: true } }
        }
    });
    res.json(accesses);
});

exports.approveAccess = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        throw new AppError("Invalid request", 400);
    }

    const updated = await prisma.serviceAccess.update({
        where: { id },
        data: { approved: true }
    });
    res.json({ message: "Access request approved", updated });
});

exports.rejectAccess = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        throw new AppError("Invalid request", 400);
    }

    const deleted = await prisma.serviceAccess.delete({
        where: { id }
    });
    res.json({ message: "Access request rejected", deleted });
});



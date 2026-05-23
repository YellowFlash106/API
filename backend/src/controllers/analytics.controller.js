const prisma = require('../utils/prisma');

exports.getOverView = async ( req, res) =>{
    try {
        const totalRequests = await prisma.requestLog.count();

        const successRequests = await prisma.requestLog.count({
            where :{
                status: {
                    lt : 400
                }
            }
        })
        const failedRequests = await prisma.requestLog.count({
            where :{
                status: {
                    gte: 400
                }
            }
        });
        res.json({
            totalRequests,
            successRequests,
            failedRequests
        });
    }
    catch (error){
        console.error("Analytics overview error:", error);
        res.status(500).json({ error : "somthing went wrong" });
    }
}
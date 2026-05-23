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

exports.getServiceAnalytics = async (req, res) => {
    try{
        const usageData = await prisma.requestLog.groupBy({
            by :["serviceId"],
            _count:{
                id :true
            },
            orderBy:{
                _count:{
                    id: "desc"
                }
            }
        });

        const services = await prisma.service.findMany();

        const result = usageData.map((item) =>{
            const service = services.find(s => s.id === item.serviceId);

            return {
                serviceId: item.serviceId,
                serviceName: service ? service.name : "Unknown Service",
                requestCount: item._count.id
            }
        })


        res.json(result);
    } catch (error) {
        console.error("Analytics services error:", error);
        res.status(500).json({ message: "Error fetching service analytics" });
    }
};

exports.getUserAnalytics = async (req, res) => {
    try{
        const userData = await prisma.requestLog.groupBy({
            by :["apiKeyId"],
            _count:{
                id :true
            },
            orderBy:{
                _count:{
                    id: "desc"
                }
            }
        });
        const apiKeys = await prisma.apiKey.findMany({
            include:{
                user :true
            }
        });

        const result = userData.map((item) =>{
            const key = apiKeys.find( k=> k.id === item.apikeyId);
            return {
                apiKeyId: item.apiKeyId,
                userName: key && key.user ? key.user.name : "Unknown User",
                requestCount: item._count.id
            }
        })
        res.json(result);
    }
    catch(error){
        console.error("Analytics user error:", error);
        res.status(500).json({ message: "Error fetching user analytics" });
    }
}


exports.getErrorAnalytics = async (req, res) => {
    try{
        const userData = await prisma.requestLog.groupBy({
            by :["apiKeyId"],
            where:{
                status:{
                    gte: 400
                }
            },
            _count:{
                id :true
            },
            orderBy:{
                _count:{
                    id: "desc"
                }
            }
        });
        const services = await prisma.apiKey.findMany();

        const result = userData.map((item) =>{
            const service = services.find( k=> k.id === item.apikeyId);
            return {
                serviceId: item.serviceId,
                serviceName: service ? service.name : "Unknown Service",
                totalErrors: item._count.id
            }
        })
        res.json(result);
    }
    catch(error){
        console.error("Analytics error error:", error);
        res.status(500).json({ message: "Error fetching error analytics" });
    }
}


exports.getDailyAnalytics = async (req, res) => {
    try{
        const logs = await prisma.requestLog.findMany({
            select:{
                createdAt: true,
                status: true
            }
        });
        const dailyData ={};
        logs.forEach(log =>{
            const date = log.createdAt.toISOString().split('T')[0];
            if(!dailyData[date]){
                dailyData[date] = 0;
            }
            dailyData[date] += 1;
        });

        const result = Object.keys(dailyData).map(date => ({
            date,
            totalRequests: dailyData[date]
        }));

        result.sort((a,b) => new Date(a.date) - new Date(b.date));
        res.json(result);
    }
    catch(error){
        console.error("Analytics error error:", error);
        res.status(500).json({ message: "Error fetching error analytics" });
    }
}
const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');

exports.getOverView = asyncHandler(async (req, res) => {
    const totalRequests = await prisma.requestLog.count();

    const successRequests = await prisma.requestLog.count({
        where: {
            status: {
                lt: 400
            }
        }
    });
    const failedRequests = await prisma.requestLog.count({
        where: {
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
});

exports.getServiceAnalytics = asyncHandler(async (req, res) => {
    const usageData = await prisma.requestLog.groupBy({
        by: ["serviceId"],
        _count: {
            id: true
        },
        orderBy: {
            _count: {
                id: "desc"
            }
        }
    });

    const services = await prisma.service.findMany();

    const result = usageData.map((item) => {
        const service = services.find(s => s.id === item.serviceId);

        return {
            serviceId: item.serviceId,
            serviceName: service ? service.name : "Unknown Service",
            requestCount: item._count.id
        };
    });

    res.json(result);
});

exports.getUserAnalytics = asyncHandler(async (req, res) => {
    // Get all users, including their API keys and the request logs count for those keys
    const users = await prisma.user.findMany({
        include: {
            apiKeys: {
                select: {
                    requestLogs: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });

    const result = users.map((u) => {
        // Calculate the sum of all requests across all API keys for this user
        const totalRequests = u.apiKeys.reduce((sum, key) => sum + (key.requestLogs?.length || 0), 0);

        return {
            id: u.id,
            userName: u.email.split('@')[0] || 'Unknown User',
            email: u.email,
            role: u.role,
            status: 'active',
            requests: totalRequests,
            joined: new Date(u.createdAt).toLocaleDateString()
        };
    });

    res.json(result);
});


exports.getErrorAnalytics = asyncHandler(async (req, res) => {
    // Get total requests per service
    const totalRequestsData = await prisma.requestLog.groupBy({
        by: ["serviceId"],
        _count: { id: true }
    });

    // Get failed requests per service
    const serviceData = await prisma.requestLog.groupBy({
        by: ["serviceId"],
        where: {
            status: {
                gte: 400
            }
        },
        _count: {
            id: true
        },
        orderBy: {
            _count: {
                id: "desc"
            }
        }
    });
    const services = await prisma.service.findMany();

    const result = serviceData.map((item) => {
        const service = services.find(s => s.id === item.serviceId);
        const totalReq = totalRequestsData.find(t => t.serviceId === item.serviceId)?._count.id || 0;
        const rate = totalReq > 0 ? ((item._count.id / totalReq) * 100).toFixed(1) + "%" : "0%";
        return {
            serviceId: item.serviceId,
            serviceName: service ? service.name : "Unknown Service",
            totalErrors: item._count.id,
            rate
        };
    });
    res.json(result);
});


exports.getDailyAnalytics = asyncHandler(async (req, res) => {
    const logs = await prisma.requestLog.findMany({
        select: {
            createdAt: true,
            status: true
        }
    });
    const dailyData = {};
    logs.forEach(log => {
        const date = log.createdAt.toISOString().split('T')[0];
        if (!dailyData[date]) {
            dailyData[date] = { requests: 0, errors: 0 };
        }
        dailyData[date].requests += 1;
        if (log.status >= 400) {
            dailyData[date].errors += 1;
        }
    });

    const result = Object.keys(dailyData).map(date => ({
        date,
        totalRequests: dailyData[date].requests,
        totalErrors: dailyData[date].errors
    }));

    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(result);
});
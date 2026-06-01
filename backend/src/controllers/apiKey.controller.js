const prisma = require('../utils/prisma.js');
const { generateApiKey, hashApiKey } = require("../utils/apiKey");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.createApiKey = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const name = req.body?.name || null;

    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    const rawKey = generateApiKey();
    const keyHash = hashApiKey(rawKey);

    const savedKey = await prisma.apiKey.create({
        data: {
            keyHash,
            userId
        }
    });

    res.status(201).json({
        id: savedKey.id,
        name,
        key: rawKey,
        status: savedKey.revoked ? "revoked" : "active",
        createdAt: savedKey.createdAt
    });
});

exports.listApiKeys = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    const apiKeys = await prisma.apiKey.findMany({
        where: { userId },
        include: {
            _count: { select: { requestLogs: true } },
            requestLogs: {
                select: { createdAt: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    const result = apiKeys.map((key) => ({
        id: key.id,
        name: `API Key ${key.id}`,
        key: null,
        status: key.revoked ? 'revoked' : 'active',
        createdAt: key.createdAt,
        lastUsed: key.requestLogs[0]?.createdAt || null,
        requests: key._count.requestLogs,
    }));

    res.json(result);
});

exports.revokeApiKey = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const id = parseInt(req.params.id, 10);

    if (!userId || Number.isNaN(id)) {
        throw new AppError("Invalid request", 400);
    }

    const key = await prisma.apiKey.findFirst({
        where: { id, userId },
    });

    if (!key) {
        throw new AppError("API key not found", 404);
    }

    const updated = await prisma.apiKey.update({
        where: { id },
        data: { revoked: true },
    });

    res.json({
        id: updated.id,
        status: updated.revoked ? 'revoked' : 'active',
    });
});


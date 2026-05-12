const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma.js');
const generateApiKey = require('../utils/generateApiKey.js');

exports.createApiKey = async (req, res) =>{
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const rawKey = generateApiKey();
    const hashKey = await bcrypt.hash(rawKey, 10);

    const apiKey = await prisma.apiKey.create({
        data: {
            key: hashKey,
            userId,
        },
    });

    res.status(201).json({
        apiKey: rawKey,
        id: apiKey.id,
    });
}
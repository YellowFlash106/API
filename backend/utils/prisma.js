const { PrismaClient } = require("@prisma/client");

// Some generated Prisma clients expect an explicit options object when
// constructed. Provide an empty options object to ensure compatibility.
const prisma = new PrismaClient({});

module.exports = prisma;
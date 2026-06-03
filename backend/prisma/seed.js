require('dotenv').config();
const prisma = require('../src/utils/prisma.js');

async function main() {
  console.log('Seeding database...');

  const bcrypt = require('bcrypt');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@forge.com' },
    update: {},
    create: {
      email: 'admin@forge.com',
      password: adminPasswordHash,
      role: 'admin'
    }
  });

  console.log('Seeded admin user:', admin.email);

  // Create example service
  const service = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Example Service',
      description: 'A simple test service to demonstrate authentication, rate-limiting, and analytics.',
      endpoint: '/api/example'
    }
  });

  console.log('Seeded services:', service);

  // Create an API key for the admin
  let apiKey = await prisma.apiKey.findFirst({
    where: { userId: admin.id }
  });

  if (!apiKey) {
    const { hashApiKey } = require('../src/utils/apiKey');
    const mockHash = hashApiKey('mock-key-123456');
    apiKey = await prisma.apiKey.create({
      data: {
        userId: admin.id,
        keyHash: mockHash
      }
    });
    console.log('Seeded API key for admin user');
  }

  // Seed request logs for dashboard analytics if empty
  const logCount = await prisma.requestLog.count();
  if (logCount === 0) {
    console.log('Seeding request logs for the past 7 days...');
    const now = new Date();
    const logs = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      // Seed successful requests (10 - 25 per day)
      const successCount = Math.floor(Math.random() * 15) + 10;
      for (let j = 0; j < successCount; j++) {
        logs.push({
          apiKeyId: apiKey.id,
          serviceId: service.id,
          status: 200,
          createdAt: new Date(date.getTime() + Math.random() * 86400000)
        });
      }

      // Seed failed requests (1 - 5 per day)
      const failedCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < failedCount; j++) {
        const statuses = [400, 401, 403, 500];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        logs.push({
          apiKeyId: apiKey.id,
          serviceId: service.id,
          status: status,
          createdAt: new Date(date.getTime() + Math.random() * 86400000)
        });
      }
    }

    await prisma.requestLog.createMany({
      data: logs
    });
    console.log(`Seeded ${logs.length} request logs.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

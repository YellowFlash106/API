require('dotenv').config();
const prisma = require('../src/utils/prisma.js');

async function main() {
  console.log('Seeding database...');

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

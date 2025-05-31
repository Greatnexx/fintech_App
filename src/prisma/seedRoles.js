import prisma from './client.js';

async function seedRoles() {
  try {
    const roles = ['regular_user', 'staff', 'admin'];

    for (const role of roles) {
      await prisma.roles.upsert({
        where: { name: role },
        update: {},
        create: {
          name: role,
        },
      });

    }

  } catch (error) {
    // eslint-disable-next-line
    console.error(' Error seeding roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRoles();

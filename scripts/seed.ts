const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

// Add multiple categories
async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: 'Accounting' },
        { name: 'Artificial Intelligence' },
        { name: 'Blockchain' },
        { name: 'Career Development' },
        { name: 'Cloud Computing' },
        { name: 'Computer Science' },
        { name: 'Cybersecurity' },
        { name: 'Data Science' },
        { name: 'DevOps' },
        { name: 'Engineering' },
        { name: 'Entrepreneurship' },
        { name: 'Filming' },
        { name: 'Finance' },
        { name: 'Fitness' },
        { name: 'Language' },
        { name: 'Machine Learning' },
        { name: 'Mobile Development' },
        { name: 'Music' },
        { name: 'Photography' },
        { name: 'Sports' },
        { name: 'UI/UX Design' },
        { name: 'Web Development' },
      ],
    });
  } catch (error) {
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}

main();

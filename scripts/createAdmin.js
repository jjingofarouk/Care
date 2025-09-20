// 7. Setup script to create initial admin - /scripts/createAdmin.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@carewave.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  
  try {
    const existing = await prisma.userRegistration.findUnique({
      where: { email },
    });

    if (existing) {
      console.log('Admin already exists');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.userRegistration.create({
      data: {
        email,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
      },
    });

    console.log(`Admin created: ${email}`);
    console.log('Please change the password after first login');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
import { AppDataSource } from '../../data-source';
import { Admin } from '../../modules/auth/entities/admin.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import bcrypt from 'bcrypt';
async function seedAdmins() {
  const connection = await AppDataSource.initialize();

  const adminRepo = connection.getRepository(Admin);

  const adminPassword = process.env.PASSWORD_ADMIN

  const roleRepo = connection.getRepository(Role);
  
  const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  if (!adminRole) { throw new Error('Admin role not found'); }

  const hashedPassword1 = await bcrypt.hash(adminPassword, 10);
  const hashedPassword2 = await bcrypt.hash(adminPassword, 10);
  const hashedPassword3 = await bcrypt.hash(adminPassword, 10);

  
  const admins = [
    { name: 'admin1', password: hashedPassword1, role: adminRole },
    { name: 'admin2', password: hashedPassword2, role: adminRole },
    { name: 'admin3', password: hashedPassword3, role: adminRole },
  ];

  await adminRepo.save(admins, { chunk: 3 }); 

  await connection.destroy();
  console.log('Admins seeding completed!');
}

seedAdmins().catch(err => {
  console.error('Seeding failed:', err);
});
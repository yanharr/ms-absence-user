import { AppDataSource } from '../../data-source';
import { Role } from '../../modules/auth/entities/role.entity';

async function seedRoles() {
  const connection = await AppDataSource.initialize();

  const roleRepo = connection.getRepository(Role);

  const roles = [
    { name: 'admin', description: 'Admin with admin page access' },
    { name: 'employee', description: 'Employee with employee page access' },
  ];

  await roleRepo.save(roles, { chunk: 10 }); 

  await connection.destroy();
  console.log('Roles seeding completed!');
}

seedRoles().catch(err => {
  console.error('Seeding failed:', err);
});
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.employee.deleteMany();

  await prisma.employee.createMany({
    data: [
      {
        employeeId: 'EMP1001',
        name: 'Alice Johnson',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        status: 'Active',
        joiningDate: new Date('2022-01-15'),
        basicSalary: 120000,
      },
      {
        employeeId: 'EMP1002',
        name: 'Bob Smith',
        position: 'Product Manager',
        department: 'Product',
        status: 'Active',
        joiningDate: new Date('2021-09-01'),
        basicSalary: 110000,
      },
      {
        employeeId: 'EMP1003',
        name: 'Carol Lee',
        position: 'HR Specialist',
        department: 'Human Resources',
        status: 'On Leave',
        joiningDate: new Date('2020-06-10'),
        basicSalary: 75000,
      },
      {
        employeeId: 'EMP1004',
        name: 'David Kim',
        position: 'UX Designer',
        department: 'Design',
        status: 'Active',
        joiningDate: new Date('2019-03-20'),
        basicSalary: 95000,
      },
      {
        employeeId: 'EMP1005',
        name: 'Emma Wilson',
        position: 'Marketing Manager',
        department: 'Marketing',
        status: 'Active',
        joiningDate: new Date('2023-01-05'),
        basicSalary: 105000,
      },
      {
        employeeId: 'EMP1006',
        name: 'Frank Chen',
        position: 'DevOps Engineer',
        department: 'Engineering',
        status: 'Active',
        joiningDate: new Date('2022-08-15'),
        basicSalary: 115000,
      },
      {
        employeeId: 'EMP1007',
        name: 'Grace Martinez',
        position: 'Sales Representative',
        department: 'Sales',
        status: 'Inactive',
        joiningDate: new Date('2021-11-30'),
        basicSalary: 65000,
      },
      {
        employeeId: 'EMP1008',
        name: 'Henry Taylor',
        position: 'Data Analyst',
        department: 'Data Science',
        status: 'Active',
        joiningDate: new Date('2023-03-01'),
        basicSalary: 85000,
      }
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
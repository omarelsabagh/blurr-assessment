const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      {
        employeeId: 'EMP1001',
        name: 'Alice Johnson',
        position: 'Software Engineer',
        department: 'Engineering',
        status: 'Active',
        joiningDate: new Date('2022-01-15'),
        basicSalary: 85000,
      },
      {
        employeeId: 'EMP1002',
        name: 'Bob Smith',
        position: 'Product Manager',
        department: 'Product',
        status: 'Active',
        joiningDate: new Date('2021-09-01'),
        basicSalary: 95000,
      },
      {
        employeeId: 'EMP1003',
        name: 'Carol Lee',
        position: 'HR Specialist',
        department: 'Human Resources',
        status: 'On Leave',
        joiningDate: new Date('2020-06-10'),
        basicSalary: 60000,
      },
      {
        employeeId: 'EMP1004',
        name: 'David Kim',
        position: 'Designer',
        department: 'Design',
        status: 'Inactive',
        joiningDate: new Date('2019-03-20'),
        basicSalary: 70000,
      },
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
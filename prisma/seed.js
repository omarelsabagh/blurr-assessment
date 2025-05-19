const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      {
        employee_id: 'EMP1001',
        name: 'Alice Johnson',
        position: 'Software Engineer',
        department: 'Engineering',
        status: 'Active',
        joining_date: new Date('2022-01-15'),
        basic_salary: 85000,
      },
      {
        employee_id: 'EMP1002',
        name: 'Bob Smith',
        position: 'Product Manager',
        department: 'Product',
        status: 'Active',
        joining_date: new Date('2021-09-01'),
        basic_salary: 95000,
      },
      {
        employee_id: 'EMP1003',
        name: 'Carol Lee',
        position: 'HR Specialist',
        department: 'Human Resources',
        status: 'On Leave',
        joining_date: new Date('2020-06-10'),
        basic_salary: 60000,
      },
      {
        employee_id: 'EMP1004',
        name: 'David Kim',
        position: 'Designer',
        department: 'Design',
        status: 'Inactive',
        joining_date: new Date('2019-03-20'),
        basic_salary: 70000,
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
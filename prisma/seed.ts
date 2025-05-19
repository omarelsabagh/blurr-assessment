import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert employees using raw SQL
  await prisma.$executeRaw`
    INSERT INTO Employee (
      employee_id,
      name,
      position,
      department,
      status,
      joining_date,
      basic_salary,
      created_at,
      updated_at
    ) VALUES
      ('EMP1001', 'Alice Johnson', 'Software Engineer', 'Engineering', 'Active', '2022-01-15', 85000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('EMP1002', 'Bob Smith', 'Product Manager', 'Product', 'Active', '2021-09-01', 95000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('EMP1003', 'Carol Lee', 'HR Specialist', 'Human Resources', 'On Leave', '2020-06-10', 60000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('EMP1004', 'David Kim', 'Designer', 'Design', 'Inactive', '2019-03-20', 70000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('EMP1005', 'Emma Wilson', 'Marketing Manager', 'Marketing', 'Active', '2023-01-05', 105000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('EMP1006', 'Frank Chen', 'DevOps Engineer', 'Engineering', 'Active', '2022-08-15', 115000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('EMP1007', 'Grace Martinez', 'Sales Representative', 'Sales', 'Inactive', '2021-11-30', 65000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('EMP1008', 'Henry Taylor', 'Data Analyst', 'Data Science', 'Active', '2023-03-01', 85000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;

  // Create some initial salary records for the current month
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // Get all employees
  const employees = await prisma.$queryRaw`
    SELECT employee_id FROM Employee
  `;

  // Insert salary records for each employee
  for (const employee of employees as { employee_id: string }[]) {
    const bonus = Math.floor(Math.random() * 5000); // Random bonus between 0 and 5000
    const deductible = Math.floor(Math.random() * 2000); // Random deductible between 0 and 2000

    await prisma.$executeRaw`
      INSERT INTO Salary (
        employee_id,
        year,
        month,
        bonus,
        deductible,
        created_at,
        updated_at
      ) VALUES (
        ${employee.employee_id},
        ${year},
        ${month},
        ${bonus},
        ${deductible},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `;
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
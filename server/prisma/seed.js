const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing Enterprise Seed Data ---');

  const employees = [
    { first: 'Ankit', last: 'Bharadva', email: 'ankit.bharadva@kinetix.io', role: 'ADMIN', id: 'OIANBH20260001' },
    { first: 'Sarah', last: 'Jennings', email: 's.jennings@kinetix.io', role: 'EMPLOYEE', id: 'OIANJS20260002' },
    { first: 'Michael', last: 'Chen', email: 'm.chen@kinetix.io', role: 'EMPLOYEE', id: 'OIANMC20260003' },
    { first: 'Elena', last: 'Rodriguez', email: 'elena.r@kinetix.io', role: 'EMPLOYEE', id: 'OIANER20260004' },
    { first: 'David', last: 'Smith', email: 'd.smith@kinetix.io', role: 'EMPLOYEE', id: 'OIANDS20260005' },
    { first: 'Priya', last: 'Sharma', email: 'p.sharma@kinetix.io', role: 'EMPLOYEE', id: 'OIANPS20260006' },
    { first: 'James', last: 'Wilson', email: 'j.wilson@kinetix.io', role: 'EMPLOYEE', id: 'OIANJW20260007' },
    { first: 'Linda', last: 'Thompson', email: 'l.thompson@kinetix.io', role: 'EMPLOYEE', id: 'OIANLT20260008' },
    { first: 'Robert', last: 'Brown', email: 'r.brown@kinetix.io', role: 'EMPLOYEE', id: 'OIANRB20260009' },
    { first: 'Sophia', last: 'Patel', email: 's.patel@kinetix.io', role: 'EMPLOYEE', id: 'OIANSP20260010' },
    { first: 'Kevin', last: 'Lee', email: 'k.lee@kinetix.io', role: 'EMPLOYEE', id: 'OIANKL20260011' },
    { first: 'Rachel', last: 'Green', email: 'r.green@kinetix.io', role: 'EMPLOYEE', id: 'OIANRG20260012' },
    { first: 'Chris', last: 'Evans', email: 'c.evans@kinetix.io', role: 'EMPLOYEE', id: 'OIANCE20260013' },
    { first: 'Emma', last: 'Watson', email: 'e.watson@kinetix.io', role: 'EMPLOYEE', id: 'OIANEW20260014' },
    { first: 'Daniel', last: 'Craig', email: 'd.craig@kinetix.io', role: 'EMPLOYEE', id: 'OIANDC20260015' },
    { first: 'Monica', last: 'Geller', email: 'm.geller@kinetix.io', role: 'EMPLOYEE', id: 'OIANMG20260016' },
    { first: 'Chandler', last: 'Bing', email: 'c.bing@kinetix.io', role: 'EMPLOYEE', id: 'OIANCB20260017' },
    { first: 'Joey', last: 'Tribbiani', email: 'j.tribbiani@kinetix.io', role: 'EMPLOYEE', id: 'OIANJT20260018' },
    { first: 'Phoebe', last: 'Buffay', email: 'p.buffay@kinetix.io', role: 'EMPLOYEE', id: 'OIANPB20260019' },
    { first: 'Ross', last: 'Geller', email: 'r.geller@kinetix.io', role: 'EMPLOYEE', id: 'OIANRG20260020' }
  ];

  for (const emp of employees) {
    await prisma.user.create({
      data: {
        employeeId: emp.id,
        email: emp.email,
        password: 'secure_password_hash_2026', // Required for signup
        firstName: emp.first,
        lastName: emp.last,
        role: emp.role,
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        bankName: 'Metropolitan Reserve Bank',
        accountNumber: `8829${Math.floor(1000 + Math.random() * 9000)}441`, // Matches banking UI
        panNo: `BKZPW${Math.floor(1000 + Math.random() * 9000)}Q`,
        joiningDate: new Date('2025-01-15'),
        
        // Attendance logic for Jan 3, 2026
        attendance: {
          create: {
            date: new Date('2026-01-03'),
            checkIn: new Date('2026-01-03T09:12:00'),
            status: 'PRESENT',
            isLate: Math.random() > 0.8, // 20% chance of being marked late
            workHours: 8.5
          }
        },

        // Leave history
        leaves: {
          create: [
            {
              type: 'PAID',
              startDate: new Date('2025-12-20'),
              endDate: new Date('2025-12-22'),
              reason: 'Holiday seasonal break',
              status: 'APPROVED'
            }
          ]
        },

        // Financial setup
        salary: {
          create: {
            basicSalary: 6500.00,
            hra: 2200.00,
            allowances: 1200.00,
            deductions: 450.00,
            netSalary: 9450.00
          }
        }
      }
    });
  }

  // Activity Feed matching the screenshot
  await prisma.auditLog.createMany({
    data: [
      { action: 'APPROVE_LEAVE', details: 'Admin processed APPROVED for Ankit', createdAt: new Date('2026-01-03T12:22:35') },
      { action: 'REJECT_LEAVE', details: 'Admin processed REJECTED for Sarah', createdAt: new Date('2026-01-03T13:33:32') },
      { action: 'ATTENDANCE_FLAG', details: 'User 2 checked in late at 12:08:24 PM', createdAt: new Date('2026-01-03T12:08:24') }
    ]
  });

  console.log('--- Seed Completed: 20 Active Personnel Inserted ---');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
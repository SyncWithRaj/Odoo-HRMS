const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllEmployees = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE' // Only fetch employees, not other admins
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        employeeId: true,
        role: true,
        phone: true,
        joiningDate: true,
        // We will add dynamic attendance status later
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

module.exports = { getAllEmployees };
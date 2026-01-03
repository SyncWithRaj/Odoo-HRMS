const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get Salary by User ID
// @route   GET /api/salary/:userId
const getSalary = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Security check: Allow if Admin OR if the user is requesting their own data
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: "Access denied" });
    }

    const salary = await prisma.salary.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.json(salary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create or Update Salary (Admin Only)
// @route   POST /api/salary/:userId
const upsertSalary = async (req, res) => {
  try {
    const { userId } = req.params;
    const { basicSalary, hra, allowances, deductions } = req.body;

    // Auto-calculate Net Salary
    const netSalary = (parseFloat(basicSalary) + parseFloat(hra) + parseFloat(allowances)) - parseFloat(deductions);

    const salary = await prisma.salary.upsert({
      where: { userId: parseInt(userId) },
      update: {
        basicSalary: parseFloat(basicSalary),
        hra: parseFloat(hra),
        allowances: parseFloat(allowances),
        deductions: parseFloat(deductions),
        netSalary
      },
      create: {
        userId: parseInt(userId),
        basicSalary: parseFloat(basicSalary),
        hra: parseFloat(hra),
        allowances: parseFloat(allowances),
        deductions: parseFloat(deductions),
        netSalary
      }
    });

    res.json(salary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update salary" });
  }
};

module.exports = { getSalary, upsertSalary };
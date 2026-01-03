const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await prisma.user.count({ where: { role: 'EMPLOYEE' } });
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const presentToday = await prisma.attendance.count({ where: { date: today } });
    
    const pendingLeaves = await prisma.leave.count({ where: { status: 'PENDING' } });

    // Recent Audit Logs
    const logs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      totalEmployees,
      presentToday,
      pendingLeaves,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: "Stats failed" });
  }
};

module.exports = { getDashboardStats };
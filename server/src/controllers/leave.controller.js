const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Apply for Leave
const applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const leave = await prisma.leave.create({
      data: {
        userId: req.user.id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      }
    });
    res.json({ message: "Leave applied", leave });
  } catch (error) {
    res.status(500).json({ message: "Failed to apply" });
  }
};

// Get My Leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

// Get All Leaves (Admin)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      include: { user: { select: { firstName: true, lastName: true, employeeId: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

// Update Status + Create Audit Log
const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;
    
    const updatedLeave = await prisma.leave.update({
      where: { id: parseInt(leaveId) },
      data: { status },
      include: { user: true }
    });

    // LAYER 2: AUDIT LOG
    await prisma.auditLog.create({
      data: {
        action: `${status}_LEAVE`,
        details: `Admin processed ${status} for ${updatedLeave.user.firstName}`
      }
    });

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
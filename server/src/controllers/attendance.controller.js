const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get Today's Status (For the Button)
const getStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day

    const record = await prisma.attendance.findFirst({
      where: {
        userId: req.user.id,
        date: today
      }
    });

    if (!record) {
      return res.json({ status: 'NOT_CHECKED_IN' });
    }
    if (record.checkOut) {
      return res.json({ status: 'CHECKED_OUT', data: record });
    }
    return res.json({ status: 'CHECKED_IN', data: record });

  } catch (error) {
    res.status(500).json({ message: "Error fetching status" });
  }
};

// 2. Check In
const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findFirst({
      where: { userId, date: today }
    });

    if (existing) {
      return res.status(400).json({ message: "Already checked in for today" });
    }

    // RULE: If check-in is after 10:00 AM, mark as LATE
    const lateThreshold = new Date(today);
    lateThreshold.setHours(10, 0, 0, 0); // Set to 10:00 AM
    const isLate = now > lateThreshold;

    const record = await prisma.attendance.create({
      data: {
        userId,
        date: today,
        checkIn: now,
        status: 'PRESENT',
        isLate: isLate // Save the flag
      }
    });

    // Optional: Log this anomaly if late (Advanced Audit)
    if (isLate) {
      // You can import prisma here if not globally available in scope, 
      // or assume it's available from top of file
       await prisma.auditLog.create({
        data: {
          action: 'ATTENDANCE_FLAG',
          details: `User ${userId} checked in late at ${now.toLocaleTimeString()}`
        }
      });
    }

    res.json({ message: isLate ? "Checked in (Marked Late)" : "Checked in successfully", record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Check-in failed" });
  }
};
// 3. Check Out
const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await prisma.attendance.findFirst({
      where: { userId, date: today }
    });

    if (!record) {
      return res.status(400).json({ message: "You have not checked in yet" });
    }
    if (record.checkOut) {
      return res.status(400).json({ message: "Already checked out" });
    }

    // Calculate Work Hours
    const checkInTime = new Date(record.checkIn);
    const diffMs = now - checkInTime;
    const hours = diffMs / (1000 * 60 * 60); // Convert ms to hours

    const updatedRecord = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        checkOut: now,
        workHours: parseFloat(hours.toFixed(2))
      }
    });

    res.json({ message: "Checked out successfully", record: updatedRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Check-out failed" });
  }
};

// 4. Get My History
const getMyHistory = async (req, res) => {
  try {
    const history = await prisma.attendance.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

// ... existing imports and functions (getStatus, checkIn, checkOut, getMyHistory)

// 5. [NEW] Get All Users' Attendance (Admin Only)
const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Default to today if no date provided
    const searchDate = date ? new Date(date) : new Date();
    searchDate.setHours(0, 0, 0, 0); // Start of day

    // Find all attendance records for this specific date
    const records = await prisma.attendance.findMany({
      where: {
        date: searchDate
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            profilePic: true
          }
        }
      },
      orderBy: {
        checkIn: 'desc'
      }
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch all attendance records" });
  }
};

// Don't forget to add it to the exports!
module.exports = { getStatus, checkIn, checkOut, getMyHistory, getAllAttendance };
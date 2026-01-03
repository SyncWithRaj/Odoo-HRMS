const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all employees (Admin only)
// @route   GET /api/users
const getAllEmployees = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE'
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
        // Add other fields if needed for the list view
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

// @desc    Get single user by ID (Admin or Self)
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        salary: true,
        attendance: {
          take: 5,
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile (Self update)
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Obtained from the 'protect' middleware
    
    // Destructure all possible fields from the frontend form
    const { 
      firstName, 
      lastName, 
      phone, 
      address, 
      dateOfBirth, 
      gender, 
      maritalStatus, 
      nationality, 
      personalEmail, 
      bankName, 
      accountNumber, 
      ifscCode, 
      panNo, 
      uanNo
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        address,
        gender,
        maritalStatus,
        nationality,
        personalEmail,
        bankName,
        accountNumber,
        ifscCode,
        panNo,
        uanNo,
        // Convert date string to Date object if provided, otherwise undefined
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // Uses the ID from the protect middleware
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllEmployees, getUserById, updateUserProfile, getUserProfile };
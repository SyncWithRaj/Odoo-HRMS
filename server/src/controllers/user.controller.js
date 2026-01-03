const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// --- 1. CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage (Memory for direct upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper: Upload to Cloudinary stream
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "hrms_profiles" }, 
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// ... (Keep getAllEmployees and getUserById as they are) ...
const getAllEmployees = async (req, res) => {
  /* ... existing code ... */
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
        profilePic: true, // <--- Add this to fetch pic in list
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

const getUserById = async (req, res) => {
    /* ... existing code ... */
      try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        salary: true,
        attendance: { take: 5, orderBy: { date: 'desc' } }
      }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- 2. UPDATE PROFILE (Handles Text + Image) ---
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Parse text fields (req.body contains text fields from FormData)
    const { 
      firstName, lastName, phone, address, dateOfBirth, 
      gender, maritalStatus, nationality, personalEmail, 
      bankName, accountNumber, ifscCode, panNo, uanNo 
    } = req.body;

    let profilePicUrl = undefined;

    // Check if file exists in request
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      profilePicUrl = result.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName, lastName, phone, address, gender, maritalStatus,
        nationality, personalEmail, bankName, accountNumber, ifscCode,
        panNo, uanNo,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        // Only update profilePic if a new one was uploaded
        ...(profilePicUrl && { profilePic: profilePicUrl }) 
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

const getUserProfile = async (req, res) => {
    /* ... existing code ... */
      try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Export 'upload' middleware so we can use it in routes
module.exports = { 
  getAllEmployees, 
  getUserById, 
  updateUserProfile, 
  getUserProfile,
  uploadMiddleware: upload.single('profilePic') 
};
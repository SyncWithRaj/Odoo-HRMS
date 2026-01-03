const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const generateEmployeeId = require('../utils/generateId');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

// Temporary OTP Store (Use Redis or DB in production)
const otpStore = new Map();

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
        user: process.env.EMAIL_USER, // Add to .env
        pass: process.env.EMAIL_PASS  // Add App Password to .env
    }
});

// --- 1. SEND OTP ---
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with expiry (10 minutes)
        otpStore.set(email, { 
            otp, 
            expires: Date.now() + 10 * 60 * 1000 
        });

        // Send Email
        await transporter.sendMail({
            from: `"Kinetix HR" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify your Kinetix Account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4F46E5;">Kinetix Verification</h2>
                    <p>Your verification code is:</p>
                    <h1 style="background: #eee; padding: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                </div>
            `
        });

        res.json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

// --- 2. REGISTER (Verifies OTP + Creates User) ---
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role, otp } = req.body;

        // 1. Verify OTP
        const storedData = otpStore.get(email);
        
        if (!storedData) {
            return res.status(400).json({ message: "OTP expired or not requested" });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP expired" });
        }

        // 2. Proceed with Registration
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const employeeId = await generateEmployeeId(firstName, lastName);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                employeeId,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                role: role || 'EMPLOYEE'
            }
        });

        // Cleanup OTP
        otpStore.delete(email);

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            message: "User verified and created successfully", 
            user: { 
                id: newUser.id,
                email: newUser.email, 
                role: newUser.role 
            },
            token 
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 3. Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            user: { 
                id: user.id,
                employeeId: user.employeeId,
                email: user.email, 
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login, sendOtp };
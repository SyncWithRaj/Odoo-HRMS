const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const generateEmployeeId = require('../utils/generateId');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;

        // 1. Check if email exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // 2. Generate Custom Employee ID
        const employeeId = await generateEmployeeId(firstName, lastName);

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User
        const newUser = await prisma.user.create({
            data: {
                employeeId,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                role: role || 'EMPLOYEE' // Default to Employee if not specified
            }
        });

        // 5. Generate Token
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            message: "User created successfully", 
            user: { 
                id: newUser.id,
                employeeId: newUser.employeeId,
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

module.exports = { register, login };
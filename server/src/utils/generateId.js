const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateEmployeeId(firstName, lastName) {
    const companyCode = "OI";
    const year = new Date().getFullYear();
    
    // Get first 2 letters of first and last name (Uppercase)
    const fNameCode = firstName.substring(0, 2).toUpperCase();
    const lNameCode = lastName.substring(0, 2).toUpperCase();
    
    // Find the last user created this year to determine the serial number
    const lastUser = await prisma.user.findFirst({
        where: {
            employeeId: {
                contains: `${companyCode}${fNameCode}${lNameCode}${year}`
            }
        },
        orderBy: {
            id: 'desc'
        }
    });

    let serial = "0001";
    
    if (lastUser) {
        // Extract the last 4 digits of the previous ID
        const lastSerial = parseInt(lastUser.employeeId.slice(-4));
        // Increment and pad with zeros
        serial = (lastSerial + 1).toString().padStart(4, '0');
    }

    return `${companyCode}${fNameCode}${lNameCode}${year}${serial}`;
}

module.exports = generateEmployeeId;
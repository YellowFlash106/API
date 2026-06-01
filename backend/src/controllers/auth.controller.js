const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const revokedTokens = [];

exports.isTokenRevoked = (token) => revokedTokens.includes(token);

exports.register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("User already exists", 409);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: "user" }
  });

  const token = generateToken(user);
  res.status(201).json({
    message: "User registered",
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid user credentials", 401);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError("Invalid password", 401);
  }

  const token = generateToken(user);
  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
});
// exports.logout = async (req, res) => {
//     let token = null;

//     if (req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//         token = req.headers.authorization.split(" ")[1];
//     } else if (req.cookies && req.cookies.token) {
//         token = req.cookies.token;
//     }

//     if (!token) return res.status(400).json({ message: "No token provided" });

//     // Add token to in-memory revoked list. For production, store this in a persistent store with expiry.
//     revokedTokens.push(token);

//     // Clear cookie if used
//     if (res.clearCookie) res.clearCookie("token");

//     res.json({ message: "Logged out" });
// };


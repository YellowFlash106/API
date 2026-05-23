const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const { generateToken } = require("../utils/jwt");

const revokedTokens = [];

exports.isTokenRevoked = (token) => revokedTokens.includes(token);

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(401).json({ message: "Email and password required" });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role: "user" },
    });

    const token = generateToken(user);
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).send("Invalid user credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid password");

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
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


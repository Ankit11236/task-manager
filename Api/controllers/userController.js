const jwt = require("jsonwebtoken");

const users = [
  {
    id: 1,
    role: "admin",
    username: "Ankit Admin",
    email: "admin@admin.com",
    password: "password",
    },
    {
        id: 2,
        role: 'user',
        username: "Ankit user",
        email: "user@user.com",
        password: "password"
    },
    {
        id: 3,
        role: 'user',
        username: "Ankit user 2",
        email: "user2@user.com",
        password: "password"
    }
];

const SECRET = "secret";

async function login(req, res, next) {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET);
    res.json({ token, role: user.role });
}

async function userList(req, res, next) {
    console.log(req.userRole);
    res.json({ data: users.filter(({ role }) => role !== 'admin') });
}


module.exports = {  login, users, userList };
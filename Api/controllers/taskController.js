const { users } = require("./userController");

async function getTasks(req, res, next) {
  const userRole = req.userRole;
  const userId = req.userId;
  let tasks = [];
  const userIds = [null, 2, 3, 4];
  for (let i = 1; i <= 50; i++) {
    const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
    tasks.push({
      id: i,
      title: `Task ${i}`,
      description: `Description for Task ${i}`,
      priority: i % 3 === 0 ? "Low" : i % 2 === 0 ? "Medium" : "High",
      dueDate: `2025-01-${String((i % 31) + 1).padStart(2, "0")}`,
      assignedTo: randomUserId,
      userId: randomUserId,
      file: null,
    });
  }
  // if (userRole === "admin") {
    return res.json({ data: tasks });
  // }
  return res.json({ data: tasks.filter((task) => task.userId === userId) });
}

module.exports = { getTasks };

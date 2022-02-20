const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const port = process.env.PORT | 3000;
const app = express();
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

// const bcryptjs = require("bcryptjs");

// const myFunction = async () => {
//   const password = "Red12345!";
//   const hashedPassword = await bcryptjs.hash(password, 8);
//   console.log(password);
//   console.log(hashedPassword);

//   const isMatch = await bcryptjs.compare("Red12345!", hashedPassword);
//   console.log(isMatch);
// };

app.listen(port, () => {
  console.log("Server is running on port: " + port + "...");
});

// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse", {
//     expiresIn: "7 days"
//   });
//   console.log(token);

//   const data = jwt.verify(token, "thisismynewcourse");
//   console.log(data);
// };

// myFunction();
// const Task = require("./model/task");
// const User = require("./model/user");

// const main = async () => {
//   // const task = await Task.findById("620a599db0e852651409e6bc");
//   // 使用前替换taskId
//   // await task.populate("owner").execPopulate();
//   // console.log(task.owner);

//   const user = await User.findById("620a599db0e852651409e6bc"); // 使用前替换userId
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };

// main();

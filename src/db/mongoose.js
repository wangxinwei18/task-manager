const mongoose = require("mongoose");

try {
  mongoose.connect(
    // use ./config/dev.env and install: npm i env-cmd
    process.env.MONGODB_URL,
    {
      auth: { authSource: "task-manager-api" },
      user: process.env.USER,
      pass: process.env.PASS,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
} catch (error) {
  console.log(err);
}

mongoose.connection
  .once("open", function () {
    console.log("database connected successfully!");
  })
  .on("error", function (err) {
    throw err;
  });

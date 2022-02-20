const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/model/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  age: 23,
  email: "mike@163.com",
  password: "1234567",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = {
  userOneId,
  userOne,
  setupDatabase
};

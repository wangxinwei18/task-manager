const express = require("express");
const auth = require("../middleware/auth");
const User = require("../model/user");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/user/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["age", "name", "email", "password", "__v"];

  const flag = updates.every(update => allowedUpdates.includes(update));

  if (!flag) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  updates.forEach(update => {
    req.user[update] = req.body[update];
  });

  await req.user.save();

  res.send(req.user);
});

router.post("/user/login", async function (req, res) {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const upload = multer({
  limits: {
    fileSize: 4000000 //4M bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|gif|bmp|jpeg)$/gim)) {
      return cb(new Error("Please upload a picture!"));
    }
    cb(undefined, true);
  }
});

router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 350, height: 450 })
      .rotate()
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    // express api 第4个参数callback处理错误
    res.status(400).send({ error: error.message });
  }
);

router.delete("/user/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;

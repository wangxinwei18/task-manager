const express = require("express");
const Task = require("../model/task");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body, // 将body的各个对象按照key-value的方式展开
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// tasks?completed=true 条件过滤
// tasks?limit=10&skip=20 分页，每页10条，跳过20条记录
// tasks?sortBy=createdAt:desc/asc
router.get("/tasks", auth, async (req, res) => {
  let match = {};
  const sort = {};
  if (req.query.completed !== undefined) {
    match = { completed: req.query.completed };
  }
  if (req.query.sortBy) {
    const part = req.query.sortBy.split(":");
    sort[part[0]] = part[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;

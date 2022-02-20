const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/user");

const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("sign up a new user", async () => {
  const response = await request(app)
    .post("/user")
    .send({
      name: "Andrew",
      age: 22,
      email: "andrew@163.com",
      password: "1234567"
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Andrew"
    }
  });
});

test("Should login existing user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: "wrong_password"
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  console.log(`Bearer ${userOne.tokens[0].token}`);
  await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/user/me").send().expect(401);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/user/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/user/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "test/fixtures/view.jpeg")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Jess"
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Jess");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Philadelphia"
    })
    .expect(400);
});

// afterEach(() => {
//   console.log("afterEach method is called...");
// });

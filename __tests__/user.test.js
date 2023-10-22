const request = require("supertest");
const app = require("../app");
const { user } = require("../models");
const supertest = require("supertest");

const tempDataUser = {
  username: "test-adrian-assignment-3",
  password: "12345678",
};

describe("Create User", () => {
  afterAll(async () => {
    try {
      await user.destroy({
        where: {
          username: tempDataUser.username,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

  it("should create new user", async () => {
    const response = await supertest(app).post("/users").send(tempDataUser);
    expect(response.status).toBe(201);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("password");
  });

  it("should return 400 if username already exist", async () => {
    const response = await supertest(app).post("/users").send(tempDataUser);
    expect(response.status).toBe(400);
  });

  describe("List Users", () => {
    it("should return array", async () => {
      const response = await supertest(app).get("/users");
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});

describe("Login", () => {
  beforeAll(async () => {
    try {
      await user.create(tempDataUser);
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    try {
      await user.destroy({
        where: {
          username: tempDataUser.username,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

  it("should return 200 if login success", async () => {
    const response = await supertest(app)
      .post("/users/login")
      .send(tempDataUser);
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual("object");
    expect(response.body).toHaveProperty("token");
  });

  it("should return 400 if username not found", async () => {
    const response = await supertest(app).post("/users/login").send({
      username: "test-adrian-assignment-3-wrong",
      password: tempDataUser.password,
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 if password wrong", async () => {
    const response = await supertest(app).post("/users/login").send({
      username: tempDataUser.username,
      password: "12345678-wrong",
    });
    expect(response.status).toBe(400);
  });
});

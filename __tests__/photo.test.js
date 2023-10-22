const app = require("../app");
const { user, photo } = require("../models");
const supertest = require("supertest");

const tempDataUser = {
  username: "test-adrian-assignment-3",
  password: "12345678",
};

const tempDataPhotos = {
  title: "Pemandangan",
  caption: "Pemandangan ini adalahah",
  image: "https://picsum.photos/200/300",
};

describe("Authentication", () => {
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

  describe("Login", () => {
    it("should return 200 if login success", async () => {
      const response = await supertest(app)
        .post("/users/login")
        .send(tempDataUser);
      expect(response.status).toBe(200);
      expect(typeof response.body).toEqual("object");
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("Get All Photo", () => {
    beforeAll(async () => {
      try {
        await photo.create(tempDataPhotos);
      } catch (err) {
        console.log(err);
      }
    });

    afterAll(async () => {
      try {
        await photo.destroy({
          where: {
            title: tempDataPhotos.title,
          },
        });
      } catch (err) {
        console.log(err);
      }
    });

    it("should return 401 if not authenticated", async () => {
      const response = await supertest(app).get("/photos");
      expect(response.status).toBe(401);
    });
    it("should return 200 if authenticated", async () => {
      const login = await supertest(app)
        .post("/users/login")
        .send(tempDataUser);
      const response = await supertest(app)
        .get("/photos")
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(response.status).toBe(200);
    });
  });

  describe("Create Photo", () => {
    afterAll(async () => {
      try {
        await photo.destroy({
          where: {
            title: tempDataPhotos.title,
          },
        });
      } catch (err) {
        console.log(err);
      }
    });

    it("should return 401 if not authenticated", async () => {
      const response = await supertest(app).post("/photos");
      expect(response.status).toBe(401);
    });

    it("should return 201 if authenticated", async () => {
      const login = await supertest(app)
        .post("/users/login")
        .send(tempDataUser);
      const response = await supertest(app)
        .post("/photos")
        .send(tempDataPhotos)
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(response.status).toBe(201);
      expect(typeof response.body).toEqual("object");
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("caption");
      expect(response.body).toHaveProperty("image");
      expect(response.body).toHaveProperty("user_id");
    });

    it("should return 400 if image url already exist", async () => {
      const login = await supertest(app)
        .post("/users/login")
        .send(tempDataUser);
      const response = await supertest(app)
        .post("/photos")
        .send(tempDataPhotos)
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(response.status).toBe(400);
    });

    it("should return 400 if image url is not valid", async () => {
      const login = await supertest(app)
        .post("/users/login")
        .send(tempDataUser);
      const response = await supertest(app)
        .post("/photos")
        .send({
          ...tempDataPhotos,
          image: "test",
        })
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(response.status).toBe(400);
    });
  });

  describe("Get Photo By Id", () => {
    afterAll(async () => {
      try {
        await photo.destroy({
          where: {
            title: tempDataPhotos.title,
          },
        });
      } catch (err) {
        console.log(err);
      }
    });

    it("should return 200 if found", async () => {
      const login = await supertest(app)
        .post("/users/login")
        .send(tempDataUser);
      const create = await supertest(app)
        .post("/photos")
        .send(tempDataPhotos)
        .set("Authorization", `Bearer ${login.body.token}`);
      const response = await supertest(app)
        .get(`/photos/${create.body.id}`)
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(response.status).toBe(200);
      expect(typeof response.body).toEqual("object");
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("caption");
      expect(response.body).toHaveProperty("image");
      expect(response.body).toHaveProperty("user_id");
    });

    it("should return 404 if not found", async () => {
      const response = await supertest(app).get(`/photos/124124124124124124`);
      expect(response.status).toBe(404);
    });
  });
});

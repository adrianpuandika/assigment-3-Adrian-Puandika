const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;

const create = async (req, res) => {
  const { username, password } = req.body;

  // Cari user name di database
  const user = await User.findOne({
    where: {
      username,
    },
  });

  // Jika user name sudah ada, kirim response error
  if (user) {
    return res.status(400).send({
      message: "User sudah terdaftar.",
    });
  }

  const id = (await User.count()) + 1;

  const data = {
    id,
    username,
    password,
  };
  const result = await User.create(data);
  res.status(201).send(result);
};

const findAll = async (req, res) => {
  const allData = await User.findAll();
  if (allData.length > 0) {
    res.status(200).send(allData);
  } else {
    res.status(404).send({
      message: "Tidak ada data tersedia.",
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const cariUsername = await User.findOne({
      where: {
        username,
      },
    });

    if (!cariUsername) {
      res.status(400).json({
        message: "Username tidak ditemukan",
      });
      return;
    }

    if (password !== cariUsername.password) {
      res.status(400).json({
        message: "Maaf, password salah",
      });
      return;
    }

    const payload = {
      id: cariUsername.id,
      username: cariUsername.username,
    };

    const token = await jwt.sign(payload, "A2_AP", {
      expiresIn: 3600,
    });

    res.status(200).json({
      message: "Berhasil login",
      token: token,
    });
  } else {
    res.status(400).json({
      message: "Username dan password harus diisi",
    });
  }
};

module.exports = {
  create,
  findAll,
  login,
};

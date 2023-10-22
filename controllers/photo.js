const jwt = require("jsonwebtoken");

const db = require("../models");
const Photo = db.photo;

const findAll = async (req, res) => {
  const allData = await Photo.findAll();
  if (allData.length > 0) {
    res.status(200).send(allData);
  } else {
    res.status(404).send({
      message: "Tidak ada data tersedia.",
    });
  }
};

const create = async (req, res) => {
  const { title, caption, image } = req.body;

  // Cari image url yang sama di database
  const photo = await Photo.findOne({
    where: {
      image,
    },
  });

  // Jika image url sudah ada, kirim response error
  if (photo) {
    return res.status(400).send({
      message: "Photo sudah terdaftar.",
    });
  }

  // Cek jika url tidak valid
  if (!image.startsWith("https://") && !image.startsWith("http://")) {
    return res.status(400).send({
      message: "URL tidak valid.",
    });
  }

  const userId = req.user.id;

  const data = {
    title,
    caption,
    image,
    user_id: userId,
  };

  const result = await Photo.create(data);
  res.status(201).send(result);
};

const findById = async (req, res) => {
  const id = req.params.id;
  const data = await Photo.findByPk(id);
  if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send({
      message: "Data tidak ditemukan.",
    });
  }
};

module.exports = {
  findAll,
  create,
  findById,
};

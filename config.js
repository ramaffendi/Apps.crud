const mongoose = require("mongoose");

const connect = "mongodb://localhost:27017/latihanke2";

const data = async () => {
  try {
    await mongoose.connect(connect, console.log("mongodb sukses"));
  } catch (err) {
    console.log("error pak", err);
  }
};

data();

// buat schema
const loginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: "users" }
);

// collections
const collections = new mongoose.model("users", loginSchema);

module.exports = collections;

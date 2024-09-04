const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const collections = require("../config");

// app.use((req, res, next) => {
//   if (req.path === "/css/style.css") {
//     return res.status(404).send("Cannot GET /css/style.css");
//   }
//   next();
// });
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "signup.html"));
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };
  //check jika nama sudah ada
  const sudahAda = await collections.findOne(data);
  if (sudahAda) {
    res.send("User sudah ada, harap daftar dengan user yang beda");
  } else {
    const hashPw = 10;
    const hashed = await bcrypt.hash(data.password, hashPw);

    data.password = hashed;

    const userData = await collections.insertMany(data);
    console.log(userData);

    return res.send("Signup berhasil");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await collections.findOne({ name: req.body.username });

    if (!user) {
      return res.status(404).send("User tidak ditemukan");
    }

    // Verifikasi password
    const pwdMatch = await bcrypt.compare(req.body.password, user.password);
    if (pwdMatch) {
      // Arahkan ke halaman welcome
      return res.sendFile(path.join(__dirname, "../public/index.html"));
    } else {
      return res.status(401).send("Password salah");
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Wrong details");
  }
});

app.listen(4000, () => {
  console.log("Server berhasil berjalan di port 4000");
});

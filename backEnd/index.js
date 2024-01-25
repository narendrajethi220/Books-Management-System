const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "4321@Loc",
  database: "bookshopdatabase",
});

db.connect((err) => {
  if (err) {
    console.log("Error in connecting to the database");
    return;
  }
  console.log("Connected to the database");
});

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    return cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Hello from the Back-End");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error executing the query", details: err });
    }
    return res.json(result);
  });
});

app.get("/books/:id", (req, res) => {
  const q = "SELECT * FROM books Where ID=?";
  const id = req.params.id;
  db.query(q, [id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.post("/books", upload.single("cover"), (req, res) => {
  const q = "INSERT INTO books(title,descr,cover,price) VALUES (?,?,?,?)";
  const values = [
    req.body.title,
    req.body.descr,
    req.file ? req.file.filename : null,
    req.body.price,
  ];
  db.query(q, values, (err, result) => {
    if (err) {
      return res.status(500).send(`Error in inserting values ${err.message}`);
    } else {
      return res
        .status(200)
        .send(`Values Inserted Successfully ${result.affectedRows}`);
    }
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id; // Declare bookId here, accessible to both queries

  db.query("SELECT cover FROM books WHERE id=?", [bookId], (er, result) => {
    if (er) {
      return res.send(er);
    }
    const filename = result[0].cover;
    const imagePath = `public/images/${filename}`;
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
        return res.status(500).send("Error deleting image");
      }
      db.query("DELETE FROM books WHERE id=?", bookId, (err, result) => {
        if (err) {
          return res.send(err);
        }
        return res.send("Book and image have been deleted successfully");
      });
    });
  });
});

app.put("/books/:id", upload.single("cover"), (req, res) => {
  const bookId = req.params.id;
  // console.log(bookId);
  const { title, descr, price } = req.body;
  // console.log("Request Body:", req.body);
  // console.log("Request File:", req.file);
  var q = "UPDATE books SET `title`=?,`descr`=?,`price`=?";
  const values = [title, descr, price];
  if (req.file) {
    const filename = req.file.filename;
    values.push(filename);
    q += ", `cover`=?";
  }
  q += "WHERE id=?";
  values.push(bookId);
  db.query(q, [...values], (err, result) => {
    if (err) return res.json(err);
    return res.send("Book has been Updated Successfully");
  });
});

const port = 3002;
app.listen(port, () => {
  console.log("Server is running at port number " + port);
});

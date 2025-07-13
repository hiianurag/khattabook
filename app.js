const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    res.render("index", { files });
  });
});

app.get("/create", (req, res) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const formattedDate = `${day}-${month}-${year}.txt`;

  fs.writeFile(`./files/${formattedDate}`, "heyy", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send("file created");
  });
});

app.get(`/edit/:filename`, (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.render("edit", { data, filename: req.params.filename });
  });
});

app.post(`/update/:filename`, (req, res) => {
  fs.writeFile(`./files/${req.params.filename}`, req.body.content, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    if (err) {
      res.send(err);
      return;
    }
    res.redirect("/");
  });
});

app.listen(3000);
